import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import fastifyDisablecache from 'fastify-disablecache';
import { readdir } from 'node:fs/promises';
import logger from './utils/logger.ts';

export default class WebServer {
  /** A map holding all of the handlers, method by its respected callback */
  #handlers: Map<string, IWebHandler['callback']> = new Map();

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

  /** Loads all of the handlers */
  async #loadHandlers() {
    const files: string[] = await readdir('src/handlers/web');

    for (const file of files) {
      const { default: handler } = await import(`./handlers/web/${file}`) as { default: IWebHandler };

      this.#handlers.set(handler.method, handler.callback);
    }
  }

  /** Starts the web server */
  async start() {
    await this.#loadHandlers();

    this.#app.register(fastifyHelmet, { contentSecurityPolicy: false });
    this.#app.register(fastifyStatic, { root: `${import.meta.dirname}\\public`, prefix: '/', wildcard: false });
    this.#app.register(fastifyDisablecache);

    this.#app.decorate('database', this.database);
    this.#app.decorate('logger', this.logger);

    this.#app.setNotFoundHandler((_, res) => res.code(404).type('text/html').send('Not Found'));
    this.#app.addHook('onListen', () => this.logger.info(`Web server listening on ${process.env.WEB_HOST}:${process.env.WEB_PORT}.`));
    this.#app.addHook('preHandler', async (req, res) => {
      const { method } = req.query as { method?: string };
      if (!method) return;

      const callback = this.#handlers.get(method);
      if (!callback) return this.logger.warn(`Unknown incoming HTTP request ${method}`);

      try {
        await callback(req, res);
      } catch (err: any) {
        if (!res.sent) {
          if (err?.code === 'ER_DUP_ENTRY') {
            return res.type('text/xml').send(`<rsp stat="fail"><err code="4" msg="Username already exists" /></rsp>`);
          } else if (err?.code === 'ER_UNK_ENTRY') {
            return res.send('Unknown user');
          } else {
            this.logger.error('Error while handling incoming HTTP request', err);
            return res.status(500).type('text/plain').send('Server error');
          }
        }
      }
    });

    await this.#app.listen({ host: process.env.WEB_HOST, port: process.env.WEB_PORT });
  }

  /** Stops the web server */
  async stop() {
    await this.#app.close();
  }
}