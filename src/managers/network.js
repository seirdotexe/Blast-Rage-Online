import { readdir } from 'node:fs/promises';

export default class NetworkManager {
  /**
   * A map holding all of the handlers, opcode by its respected callback
   * @private
   * @type {Map<string, Function>}
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
   * @param {string} data - The data string from Flash XML socket
   * @param {Client} client - The client sending this data to our server
   */
  handleData(data, client) {
    try {
      if (data === '<policy-file-request/>') {
        return client.send(`<cross-domain-policy><allow-access-from domain='*' to-ports='*' /></cross-domain-policy>`);
      }

      const opcode = data.slice(0, 2);
      const params = data.slice(2);
      const callback = this.#handlers.get(opcode);

      if (!callback) {
        return client.server.logger.warn(`Unknown incoming data ${data}`);
      }

      client.server.logger.info(`Incoming data ${data}`);
      callback(params, client); // Todo - What if async?
    } catch (err) {
      client.server.logger.error('Error while handling incoming data', err);
    }
  }
}