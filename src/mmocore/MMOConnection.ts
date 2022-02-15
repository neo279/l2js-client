import IStream from "./IStream";
import IConnection from "./IConnection";
import Logger from "./Logger";
import IProcessable from "./IProcessable";

export default class MMOConnection implements IConnection {
  protected logger: Logger = Logger.getLogger(this.constructor.name);

  IsConnected = false;

  constructor(private stream: IStream, private handler: IProcessable) {}

  connect(): Promise<void> {
    this.logger.debug("Connecting", this.stream.toString());
    return this.stream
      .connect()
      .then(() => {
        this.IsConnected = true;
        this.logger.info("Connected", this.stream.toString());
        this.read();
      })
      .catch(() => {
        this.IsConnected = false;
        throw new Error("Connection failed to " + this.stream.toString());
      });
  }

  async read(): Promise<void> {
    if (!this.IsConnected) return;
    const data: Uint8Array = await this.stream.recv();
    if (data) {
      try {
        await this.handler.process(data);
      } catch (err) {
        this.logger.warn(err);
      }
    }
    await this.read();
  }

  write(raw: Uint8Array): Promise<void> {
    return this.stream.send(raw);
  }

  close(): Promise<void> {
    return this.stream.close().then(() => {
      this.IsConnected = false;
      this.logger.info("Disconnected", this.stream.toString());
    });
  }
}
