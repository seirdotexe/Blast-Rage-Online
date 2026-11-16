import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import fastifyDisablecache from 'fastify-disablecache';
import logger from './utils/logger.ts';

export default class WebServer {
  /** The logger instance */
  logger: ILogger = logger;
  /** The Knex provided database instance */
  database: IDatabase;
  /** The Fastify instance */
  #app: Fastify.FastifyInstance;

  /**
   * Creates a new web server instance to serve the game files to the client
   * @param database - Our Knex database instance
   */
  constructor(database: IDatabase) {
    this.database = database;
    this.#app = Fastify();
  }

  /** Starts the web server */
  async start() {
    this.#app.register(fastifyHelmet, { contentSecurityPolicy: false });
    this.#app.register(fastifyStatic, { root: `${import.meta.dirname}\\public`, prefix: '/' });
    this.#app.register(fastifyDisablecache);

    this.#app.setNotFoundHandler((_, res) => res.code(404).type('text/html').send('Not Found'));
    this.#app.addHook('onListen', () => this.logger.info(`Web server listening on ${process.env.WEB_HOST}:${process.env.WEB_PORT}.`));

    await this.#app.listen({ host: process.env.WEB_HOST, port: process.env.WEB_PORT });
  }

  /** Stops the web server */
  async stop() {
    await this.#app.close();
  }
}