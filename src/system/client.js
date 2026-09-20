import Caesar from '../utils/caesar.js';

export default class Client {
  /**
   * Creates a new client containing all player logic
   * @param {Socket} socket - The TCP socket
   * @param {GameServer} server - The game server instance
   */
  constructor(socket, server) {
    /**
     * The clients socket object
     * @type {Socket}
     */
    this.socket = socket;
    /**
     * The game server object
     * @type {GameServer}
     */
    this.server = server;
    /**
     * The logger instance
     * @type {ILogger}
     */
    this.logger = server.logger;
    /**
     * The database instance
     * @type {Database}
     */
    this.database = server.database;
  }

  /**
   * Set the client from the retrieved database user object
   * @type {todo} userObj - The retrieved database information of this client
   */
  async setClient(userObj) {
    delete userObj.password; delete userObj.banned;

    Object.assign(this, userObj); // Todo - JSDoc

    this.server.clientManager.add(this);

    // Todo - Retrieve inventory
  }

  /**
   * Update columns of the client (user) in the database
   * @param {Object<string, boolean|string|number>} updateObj - The update object containing columns and values
   */
  async updateColumn(updateObj) {
    try {
      await this.database('users').update(updateObj).where('id', this.id);
    } catch (err) {
      this.logger('Error while updating column', err);
    }
  }

  /**
   * Send data to the client
   * @param {string} data - The data to send to the client
   */
  send(data) {
    if (this.socket?.writable) {
      this.socket.write(`${Caesar.encodePacket(data)}\0`);
    }
  }

  /**
   * Disconnect the client
   */
  disconnect() {
    if (this.socket.destroyed) return;

    this.socket.end();
  }
}