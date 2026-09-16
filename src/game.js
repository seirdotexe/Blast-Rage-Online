import { createServer } from 'node:net';
import Client from './client.js';
import ClientManager from './managers/client.js';
import logger from './utils/logger.js';

export default class GameServer {
  /**
   * Creates a new game server instance to serve networking logic to the client
   */
  constructor() {
    /**
     * The client manager instance
     * @type {ClientManager}
     */
    this.clientManager = new ClientManager();
    /**
     * The logger instance
     * @type {ILogger}
     */
    this.logger = logger;
  }

  /**
   * Starts the game server
   */
  start() {
    createServer((socket) => {
      socket.setEncoding('utf8');

      const client = new Client(socket, this);
      this.clientManager.add(client);
      this.logger.info(`Client ${client.id} has connected`);

    }).listen(process.env.GAME_PORT, process.env.GAME_HOST, () => this.logger.info(`Game server listening on ${process.env.GAME_HOST}:${process.env.GAME_PORT}.`));
  }
}