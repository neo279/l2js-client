import AbstractGameCommand from "./AbstractGameCommand";
import Say2 from "../network/outgoing/game/Say2";

export default class CommandSay extends AbstractGameCommand {
  async execute(text: string): Promise<void> {
    await this.GameClient?.sendPacket(new Say2(Say2.ALL, text));
  }
}
