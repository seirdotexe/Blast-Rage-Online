import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import logger from './utils/logger.js';

export default class WebServer {
  /**
   * The Fastify instance
   * @private
   * @type {import('fastify').FastifyInstance}
   */
  #app;

  /**
   * Creates a new web server instance to serve the game files to the client
   * @param {Database} database - Our database instance
   */
  constructor(database) {
    /**
     * The Knex provided database instance
     * @type {Database}
     */
    this.database = database;
    /**
     * The logger instance
     * @type {ILogger}
     */
    this.logger = logger;
  }

  /**
   * Starts the web server
   */
  async start() {
    this.#app = Fastify();

    // Todo
    this.#app.get('/csv/', async (request, reply) => {
      console.log(request.query);

      return reply.type('text/plain').send('');
    });

    this.#app.setNotFoundHandler((_, res) => res.code(404).type('text/html').send('Not Found'));
    this.#app.register(fastifyStatic, { root: `${import.meta.dirname}\\public`, prefix: '/' });

    await this.#app.listen({ host: process.env.WEB_HOST, port: process.env.WEB_PORT });
    this.logger.info(`Web server listening on ${process.env.WEB_HOST}:${process.env.WEB_PORT}.`)

    process.on('SIGINT', async () => { await this.#app.close(); process.exit(); });
    process.on('SIGTERM', async () => { await this.#app.close(); process.exit(); })
  }
}