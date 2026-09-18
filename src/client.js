import Caesar from './utils/caesar.js';

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