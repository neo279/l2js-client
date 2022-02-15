import ReceivablePacket from "./ReceivablePacket";
import IPacketHandler from "./IPacketHandler";
import EventEmitter from "events";
import IConnection from "./IConnection";
import Logger from "./Logger";
import MMOSession from "./MMOSession";
import IProcessable from "./IProcessable";
import SendablePacket from "./SendablePacket";
import IMMOClientMutator from "./IMMOClientMutator";
import AbstractPacket from "./AbstractPacket";
import MMOConfig from "./MMOConfig";

export default abstract class MMOClient
  extends EventEmitter
  implements IProcessable
{
  protected logger: Logger = Logger.getLogger(this.constructor.name);

  abstract init(config: MMOConfig, connection?: IConnection): this;

  abstract encrypt(data: Uint8Array, offset: number, size: number): void;

  abstract decrypt(data: Uint8Array, offset: number, size: number): void;

  abstract sendPacket(packet: SendablePacket): void;

  abstract pack(packet: SendablePacket): Uint8Array;

  PacketHandler!: IPacketHandler<MMOClient>;

  Session: MMOSession = new MMOSession();

  Connection!: IConnection;

  get IsConnected(): boolean {
    return this.Connection?.IsConnected === true;
  }

  private _buffer: Uint8Array = new Uint8Array();

  private _mts: {
    [index: string]: IMMOClientMutator<MMOClient, AbstractPacket>[];
  } = {};

  private _mutate(packet: AbstractPacket): void {
    if (packet.constructor.name in this._mts) {
      this._mts[packet.constructor.name].forEach((m) => {
        this.logger.debug(
          "Mutating",
          this.constructor.name,
          m.constructor.name
        );
        try {
          m.update(packet);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

  registerMutator(mutator: IMMOClientMutator<MMOClient, AbstractPacket>): void {
    if (!(mutator.PacketType in this._mts)) {
      this._mts[mutator.PacketType] = [];
    }
    this._mts[mutator.PacketType].push(mutator);
  }

  connect(): Promise<void> {
    return this.Connection.connect();
  }

  process(raw: Uint8Array): Promise<ReceivablePacket[]> {
    return new Promise((resolve, reject) => {
      const packets = [];
      let data: Uint8Array = new Uint8Array(raw);
      if (this._buffer.byteLength > 0) {
        data = new Uint8Array(raw.byteLength + this._buffer.byteLength);
        data.set(this._buffer, 0);
        data.set(raw, this._buffer.byteLength);
        this._buffer = new Uint8Array();
      }

      let i = 0;
      while (i < data.byteLength) {
        if (data.byteLength < 2) {
          this._buffer = data.slice(i);
          reject("Incomplete packet, cannot read length");
          return;
        }

        const packetLength = data[i] + (data[i + 1] << 8);

        if (packetLength <= 2) {
          reject("Incorrect packet");
          return;
        }

        if (i + packetLength > data.byteLength) {
          this._buffer = data.slice(i);
          reject("Incomplete packet!!!" + data[i] + data[i + 1]);
          return;
        }

        const packetData = new Uint8Array(data.slice(i + 2, i + packetLength)); // +2 is for skipping the packet size
        this.decrypt(packetData, 0, packetData.byteLength);

        const rcp: ReceivablePacket = this.PacketHandler.handlePacket(
          packetData,
          this
        );
        if (rcp && rcp.read()) {
          this.logger.debug("Received", rcp.constructor.name);
          this._mutate(rcp);
          this.emit(`PacketReceived:${rcp.constructor.name}`, {
            packet: rcp,
          });
          packets.push(rcp);
        }

        i += packetLength;
      }

      resolve(packets);
    });
  }

  sendRaw(raw: Uint8Array): Promise<void> {
    return this.Connection.write(raw).catch((error) =>
      this.logger.error(error)
    );
  }

  hexString(data: Uint8Array): string {
    return (
      " ".repeat(7) +
      Array.from(new Array(16), (n, v) =>
        ("0" + (v & 0xff).toString(16)).slice(-2).toUpperCase()
      ).join(" ") +
      "\r\n" +
      "=".repeat(54) +
      "\r\n" +
      Array.from(Array.from(data), (byte, k) => {
        return (
          (k % 16 === 0
            ? ("00000" + ((Math.ceil(k / 16) * 16) & 0xffff).toString(16))
                .slice(-5)
                .toUpperCase() + "  "
            : "") +
          ("0" + (byte & 0xff).toString(16)).slice(-2) +
          ((k + 1) % 16 === 0 ? "\r\n" : " ")
        );
      })
        .join("")
        .toUpperCase() +
      "\r\n"
    );
  }
}
