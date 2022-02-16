import * as net from "net";
import IStream from "../../mmocore/IStream";

import { once } from 'events';

export default class NetSocket implements IStream {
  private _socket!: net.Socket;

  private timeoutTimer!: ReturnType<typeof setTimeout>;

  private timeout = 5000;

  constructor(private ip: string, private port: number) {}

  async connect(): Promise<void> {
    this._socket = new net.Socket();
    this._socket.setTimeout(0);
    this._socket.connect(this.port, this.ip);
    const abort = new AbortController();
    const abortTimeout = setTimeout(() => abort.abort(), this.timeout);
    await once(this._socket, 'ready', { signal: abort.signal });
    clearTimeout(abortTimeout);
  }

  async send(bytes: Uint8Array): Promise<void> {
    if (this._socket.write(bytes)) {
      return;
    }

    // Check if we are trying to write into closed socket.
    // This should not be necessary, but it seems that "once" below would wait forewer
    if (this._socket.destroyed) throw new Error('Cannot write to the socket as it was destroyed.')

    await once(this._socket, 'drain')
  }

  async recv(): Promise<Uint8Array> {
    this._socket.resume();
    const [data] = await once(this._socket, 'data');
    this._socket.pause();
    return data;
  }

  async close(): Promise<void> {
    const abort = new AbortController();
    this._socket.end();
    const abortTimeout = setTimeout(() => abort.abort(), this.timeout);
    try {
      await once(this._socket, 'close', { signal: abort.signal });
      clearTimeout(abortTimeout);
    } catch (err) {
      this._socket.destroy();
      await once(this._socket, 'close'); // Not tested
    }
  }

  toString(): string {
    return `${this.ip}:${this.port}`;
  }
}
