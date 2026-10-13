import { readdir } from 'node:fs/promises';
import Caesar from '../utils/caesar.js';

export default class NetworkManager {
  /**
   * A map holding all of the handlers, opcode by its respected callback
   * @private
   * @type {Map<string, (params: string, client: Client) => void | Promise<void>>}
   */
  #handlers = new Map();

  /**
   * Creates a new network manager instance to guide traffic to the right handler function
   */
  constructor() { }

  /**
   * Loads all of the handlers
   */
  async loadHandlers() {
    const files = await readdir('src/handlers');

    for (const file of files) {
      /** @type {{ default: IHandler }} */
      const { default: handler } = await import(`../handlers/${file}`);

      this.#handlers.set(handler.opcode, handler.callback);
    }
  }

  /**
   * Handles incoming data from the client to the server
   * @param {string} data - The incoming data
   * @param {Client} client - The client sending this data to our server
   */
  async handleData(data, client) {
    try {
      if (data === '<policy-file-request/>') return client.send(process.env.GAME_POLICY);

      // Prepare incoming data
      const packet = Caesar.decodePacket(data);
      const isObfuscated = (packet[0] !== '0');

      // The first character in a decoded packet will be the true deobfuscated opcode
      // Regular packets always start with a 0
      const opcode = isObfuscated ? Caesar.decodeInteger(packet[0]) : packet.slice(0, 2);
      const params = isObfuscated ? packet.slice(1) : packet.slice(2);

      // Clients cannot call any other opcodes before being authenticated
      if (!client?.authenticated && (opcode !== '09')) return client.disconnect();

      // Try looking for a callback to the opcode's respected handler
      const callback = this.#handlers.get(opcode);
      if (!callback) return client.logger.warn(`Unknown incoming data ${opcode}${params}`);

      // Call the handler's callback for this opcode
      client.logger.verbose(`Incoming data ${opcode}${params}`);
      await callback(params, client);
    } catch (err) {
      client.logger.error('Error while handling incoming data', err);
    }
  }
}