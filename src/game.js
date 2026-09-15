import { createServer } from 'node:net';
import logger from './utils/logger.js';

/** @module blast-rage-online/GameServer */
export default class GameServer {
  /**
   * Creates a new game server instance to serve networking logic to the client
   */
  constructor() {
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
    }).listen(process.env.GAME_PORT, process.env.GAME_HOST, () => this.logger.info(`Game server listening on ${process.env.GAME_HOST}:${process.env.GAME_PORT}.`));
  }
}