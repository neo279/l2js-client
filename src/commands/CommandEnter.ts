import { EPacketReceived } from "../events/EventTypes";
import MMOConfig from "../mmocore/MMOConfig";
import GameClient from "../network/GameClient";
import SystemMessage from "../network/incoming/game/SystemMessage";
import LoginFail from "../network/incoming/login/LoginFail";
import PlayFail from "../network/incoming/login/PlayFail";
import ServerList from "../network/incoming/login/ServerList";
import LoginClient from "../network/LoginClient";
import Appearing from "../network/outgoing/game/Appearing";
import AuthLogin from "../network/outgoing/game/AuthLogin";
import CharacterSelect from "../network/outgoing/game/CharacterSelect";
import EnterWorld from "../network/outgoing/game/EnterWorld";
import ProtocolVersion from "../network/outgoing/game/ProtocolVersion";
import RequestKeyMapping from "../network/outgoing/game/RequestKeyMapping";
import RequestManorList from "../network/outgoing/game/RequestManorList";
import ValidatePosition from "../network/outgoing/game/ValidatePosition";
import AuthGameGuard from "../network/outgoing/login/AuthGameGuard";
import RequestAuthLogin from "../network/outgoing/login/RequestAuthLogin";
import RequestServerList from "../network/outgoing/login/RequestServerList";
import RequestServerLogin from "../network/outgoing/login/RequestServerLogin";
import AbstractGameCommand from "./AbstractGameCommand";
import Logger from '../mmocore/Logger';

import { once, on } from 'events';

export default class CommandEnter extends AbstractGameCommand {
  protected _config: MMOConfig = new MMOConfig();

  async execute(config?: MMOConfig | Record<string, unknown>): Promise<{ login: LoginClient; game: GameClient }> {
    if (config) {
      this._config = { ...new MMOConfig(), ...(config as MMOConfig) };
    }

    let abort = new AbortController();

    this.LoginClient.init(this._config);
    await this.LoginClient.connect()

    const fail = [
      once(this.LoginClient, "PacketReceived:PlayFail", { signal: abort.signal }).then(() => {
        throw Error('PlayFail')
      }),
      once(this.LoginClient, "PacketReceived:LoginFail", { signal: abort.signal }).then(() => {
        throw Error('LoginFail')
      })
    ]

    try {
      await Promise.race([...fail, once(this.LoginClient, 'PacketReceived:Init', { signal: abort.signal })])

      await this.LoginClient.sendPacket(new AuthGameGuard(this.LoginClient.Session.sessionId))

      await Promise.race([...fail, once(this.LoginClient, 'PacketReceived:GGAuth', { signal: abort.signal })])

      await this.LoginClient.sendPacket(
        new RequestAuthLogin(this._config.Username, this._config.Password, this.LoginClient.Session)
      )

      await Promise.race([...fail, once(this.LoginClient, 'PacketReceived:LoginOk', { signal: abort.signal })])

      await this.LoginClient.sendPacket(new RequestServerList(this.LoginClient.Session))

      const [serverList] = await once(this.LoginClient, 'PacketReceived:ServerList', { signal: abort.signal }) as unknown as [EPacketReceived]

      await this.LoginClient.sendPacket(
        new RequestServerLogin(
          this.LoginClient.Session,
          this.LoginClient.ServerId ?? (serverList.packet as ServerList).LastServerId
        )
      );

      await Promise.race([...fail, once(this.LoginClient, 'PacketReceived:PlayOk', { signal: abort.signal })])

      // We are done with login client, reset abort controller as we would receive warning for too many event handlers attached
      abort.abort();
      abort = new AbortController();

      this.LoginClient.disconnect();
      this.LoginClient.removeAllListeners();

      const gameConfig = {
        ...this._config,
        ...{
          Ip: this.LoginClient.Session.server.host,
          Port: this.LoginClient.Session.server.port,
        },
      };

      this.GameClient.Session = this.LoginClient.Session;
      this.GameClient.init(gameConfig as MMOConfig);
      await this.GameClient.connect();

      await this.GameClient.sendPacket(new ProtocolVersion());

      await once(this.GameClient, 'PacketReceived:KeyPacket', { signal: abort.signal });

      await this.GameClient.sendPacket(new AuthLogin(this.GameClient.Session))

      await once(this.GameClient, 'PacketReceived:CharSelectionInfo', { signal: abort.signal });
      await this.GameClient.sendPacket(new CharacterSelect(this.GameClient.Config.CharSlotIndex ?? 0))

      await once(this.GameClient, 'PacketReceived:CharSelected', { signal: abort.signal });
      await this.GameClient.sendPacket(new RequestKeyMapping())
      await this.GameClient.sendPacket(new EnterWorld())

      for await (const [e] of on(this.GameClient, "PacketReceived:SystemMessage", { signal: abort.signal })) {
        if ((e.packet as SystemMessage).messageId === 34 /** WELCOME_TO_LINEAGE */) {
          Logger.getLogger('CommandEnter').info('EnterWorld system message received');
          break;
        }
      }
    } catch (err) {
      this.LoginClient.disconnect();
      this.GameClient.disconnect();
      abort.abort();
      throw err
    }

    const ret = {
      login: this.LoginClient,
      game: this.GameClient,
    }
    this.GameClient.emit("LoggedIn", ret);

    return ret;
  }
}
