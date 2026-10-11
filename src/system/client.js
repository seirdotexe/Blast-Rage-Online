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
   * Sets the client from the retrieved database user object
   * @param {UserObj} userObj - The retrieved database user object of this client
   */
  async setClient(userObj) {
    /** @type {number} */ this.mmochaId;
    /** @type {number} */ this.id = userObj.id;
    /** @type {string} */ this.username = userObj.username;
    /** @type {number} */ this.current_bits_balance = userObj.current_bits_balance;
    /** @type {number} */ this.total_bits_earned = userObj.total_bits_earned;
    /** @type {number} */ this.xcash = userObj.xcash;
    /** @type {Room}   */ this.room;

    this.server.clientManager.add(this);

    await this.updateColumn('last_login', this.database.fn.now());
  }

  /**
   * Updates a column of the client in the database's users table
   * @param {string} column - The column
   * @param {boolean|string|number} value - The value
   */
  async updateColumn(column, value) {
    try {
      await this.database('users').update(column, value).where('id', this.id);
    } catch (err) {
      this.logger('Error while updating column', err);
    }
  }

  /**
   * Sends data to the client
   * @param {string} data - The data to send to the client
   * @param {boolean} [encode=false] - If the data of this packet should be encoded
   * @param {boolean} [log=true] - If the data should be logged
   */
  send(data, encode = false, log = true) {
    if (this.socket?.writable) {
      if (log) this.logger.verbose(`Outgoing unicast@${this?.id ?? 'pending'} data ${JSON.stringify(data)}`);
      this.socket.write(`${encode ? Caesar.encodePacket(data) : data}\0`);
    }
  }

  /**
   * Disconnects the client
   */
  disconnect() {
    if (this.socket.destroyed) return;

    this.socket.end();
  }
}