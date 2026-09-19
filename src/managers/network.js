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

      const packet = Caesar.decodePacket(data);
      const isUnobfuscated = (packet[0] === '0');

      // Obfuscated packets uses only the first character for their opcode, whereas unobfuscated ones always begin with 0 and then their identifiable opcode
      const opcode = isUnobfuscated ? packet.slice(0, 2) : packet[0];
      const params = isUnobfuscated ? packet.slice(2) : packet.slice(1);
      const callback = this.#handlers.get(opcode);

      if (!callback) {
        return client.logger.warn(`Unknown incoming data ${data}`);
      }

      client.logger.info(`Incoming data ${data}`);
      await callback(params, client);
    } catch (err) {
      client.logger.error('Error while handling incoming data', err);
    }
  }
}