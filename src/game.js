import { createServer } from 'node:net';
import ClientManager from './managers/client.js';
import NetworkManager from './managers/network.js';
import Client from './system/client.js';
import KnexDatabase from './system/database.js';
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
     * The network manager instance
     * @type {NetworkManager}
     */
    this.networkManager = new NetworkManager();
    /**
     * The Knex provided database instance
     * @type {Database}
     */
    this.database = KnexDatabase;
    /**
     * The logger instance
     * @type {ILogger}
     */
    this.logger = logger;
  }

  /**
   * Starts the game server
   */
  async start() {
    await this.networkManager.loadHandlers();

    createServer((socket) => {
      socket.setEncoding('utf8');
      socket.setTimeout(10000);

      const client = new Client(socket, this);
      this.clientManager.add(client);
      this.logger.info('A new client has connected');

      // Process incoming data from the client to the server
      socket.on('data', async (data) => await this.networkManager.handleData(data.split('\0')[0], client));
      // Client gracefully says it's done sending
      socket.on('end', () => this.logger.info(`Client ${client?.id ?? 'pending'} ended the connection`));
      // Client fully closed the connection
      socket.on('close', () => this.clientManager.remove(client), this.logger.info(`Client ${client?.id ?? 'pending'} disconnected`));
      // Process socket errors
      socket.on('error', (err) => this.logger.error(`Client ${client?.id ?? 'pending'} socket error: ${err.message}`));
      // Process client timeouts
      socket.on('timeout', () => client.disconnect(), this.logger.info(`Client ${client?.id ?? 'pending'} timed out`));
    }).listen(process.env.GAME_PORT, process.env.GAME_HOST, () => this.logger.info(`Game server listening on ${process.env.GAME_HOST}:${process.env.GAME_PORT}.`));
  }
}