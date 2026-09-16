export default class Client {
  /**
   * Creates a new client containing all player logic
   * @param {Socket} socket
   * @param {GameServer} server
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
     * The clients id
     * @type {number}
     */
    this.id = Math.max(100, server.clientManager.count + 100);
    /**
     * The clients IP address
     * @type {string}
     */
    this.ip = socket.remoteAddress.split(':').pop();
  }

  /**
   * Send data to the client
   * @param {string} data - The data to send to the client
   */
  send(data) {
    if (this.socket?.writable) {
      this.socket.write(`${data}\0`);
    }
  }

  /**
   * Disconnect the client
   */
  disconnect() {
    if (this.socket.destroyed) return;

    this.server.clientManager.remove(this);
    this.socket.destroy();

    this.server.logger.info(`Client ${this.id} has been disconnected`);
  }
}