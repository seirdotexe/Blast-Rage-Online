import { readdir } from 'node:fs/promises';
import Caesar from '../utils/caesar.ts';

export default class NetworkManager {
  /** A map holding all of the handlers, opcode by its respected callback */
  #handlers: Map<string, IHandler['callback']> = new Map();

  /**
   * Creates a new network manager instance to guide traffic to the right handler function
   */
  constructor() { }

  /**
   * Loads all of the handlers
   */
  async loadHandlers() {
    const files: string[] = await readdir('src/handlers');

    for (const file of files) {
      const { default: handler } = await import(`../handlers/${file}`) as { default: IHandler };

      this.#handlers.set(handler.opcode, handler.callback);
    }
  }

  /**
   * Handles incoming data from the client to the server
   * @param data - The incoming data
   * @param client - The client sending this data to our server
   */
  async handleData(data: string, client: Client) {
    try {
      if (data === '<policy-file-request/>') return client.send(process.env.GAME_POLICY);

      // Prepare incoming data
      const packet: string = Caesar.decodePacket(data);
      const isObfuscated: boolean = (packet[0] !== '0');

      // The first character in a decoded packet will be the true deobfuscated opcode
      // Regular packets always start with a 0
      const opcode: string = isObfuscated ? String(Caesar.decodeInteger(packet.charAt(0))) : packet.slice(0, 2);
      const params: string = isObfuscated ? packet.slice(1) : packet.slice(2);

      // Clients cannot call any other opcodes before being authenticated
      if (client.mmochaId === undefined && (opcode !== '09')) return client.disconnect();

      // Try looking for a callback to the opcode's respected handler
      const callback = this.#handlers.get(opcode);
      if (!callback) return client.logger.warn(`Unknown incoming data ${opcode}${params}`);

      // Call the handler's callback for this opcode
      client.logger.info(`Incoming data ${opcode}${params}`);
      await callback(params, client);
    } catch (err) {
      client.logger.error('Error while handling incoming data', err);
    }
  }
}