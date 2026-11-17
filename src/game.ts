import { createServer } from 'node:net';
import ClientManager from './managers/client.ts';
import NetworkManager from './managers/network.ts';
import RoomManager from './managers/room.ts';
import Client from './system/client.ts';
import logger from './utils/logger.ts';

export default class GameServer {
  /** The network manager instance */
  networkManager: NetworkManager;
  /** The client manager instance */
  clientManager: ClientManager;
  /** The room manager instance */
  roomManager: RoomManager;

  /** The logger instance */
  logger: ILogger = logger;
  /** The Knex provided database instance */
  database: IDatabase;
  /** The TCP Net server instance */
  #server!: NetServer;

  /**
   * Creates a new game server instance to serve networking logic to the client
   * @param database - Our Knex database instance
   */
  constructor(database: IDatabase) {
    this.networkManager = new NetworkManager();
    this.clientManager = new ClientManager();
    this.roomManager = new RoomManager();
    this.database = database;
  }

  /** Starts the game server */
  async start() {
    await this.database.raw('SELECT 1 + 1');
    await this.networkManager.loadHandlers();
    this.roomManager.create('_');

    this.#server = createServer((socket: NetSocket) => {
      socket.setEncoding('utf8');

      const client: Client = new Client(socket, this);
      this.clientManager.add(client);
      this.logger.verbose('Client has connected');

      // Process incoming data from the client to the server
      socket.on('data', async (data: string) => await this.networkManager.handleData(data.split('\0')[0] ?? '', client));
      // Client gracefully says it's done sending
      socket.on('end', () => (client.disconnect(), this.logger.verbose('Client has ended the connection')));
      // Client fully closed the connection
      socket.on('close', () => (client.disconnect(), this.logger.verbose('Client has disconnected')));
      // Process socket errors
      socket.on('error', (err) => (client.disconnect(), this.logger.error('Client socket error', err)));
      // Process client timeouts
      socket.on('timeout', () => (client.disconnect(), this.logger.verbose('Client timed out')));
    }).listen(process.env.GAME_PORT, process.env.GAME_HOST, () => this.logger.info(`Game server listening on ${process.env.GAME_HOST}:${process.env.GAME_PORT}.`));
  }

  /** Stops the game server */
  async stop() {
    for (const client of this.clientManager.clients.values()) {
      client.disconnect();
    }

    this.#server.close();
  }
}