import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import fastifyDisablecache from 'fastify-disablecache';
import logger from './utils/logger.js';
import { hash } from './utils/scrypt.js';

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
    this.#app.register(fastifyStatic, { root: `${import.meta.dirname}\\public`, prefix: '/' });
    this.#app.register(fastifyDisablecache);
    this.#app.setNotFoundHandler((_, res) => res.code(404).type('text/html').send('Not Found'));

    // Todo - user_id 8060894
    this.#app.get('/csv/', async (req, res) => {
      const method = req?.query?.method;

      if (method === 'xgen.blastrage.user.items.list') {
        return res.type('text/plain').send('1,1\r2,1\r3,1\r7,1\r8,1\r9,1\r135,2');
      } else if (method === 'xgen.blastrage.user.tanks.list') {
        return res.type('text/plain').send('0,1,ffd71e,262626,1,9,8,135\r1,2,46b013,518f08,3,9,7\r2,3,1547ff,9caff5,2,9,7');
      }

      return res.type('text/plain').send('');
    });

    this.#app.get('/', async (req, res) => {
      const method = req?.query?.method;

      if (!method) return res.sendFile('index.html');

      if (method === 'xgen.users.add') {
        const { username, password } = req.query;
        const userObj = await this.database('users').where({ username }).first();

        if (userObj) {
          return res.type('text/xml').send(`<?xml version="1.0" encoding="utf-8" ?><rsp stat="fail"><err code="4" msg="Username already exists" /></rsp>`);
        }

        try {
          const [id] = await this.database('users').insert({ username, password: await hash(password) });

          this.logger.info(`User ${username} with ${id} has been registered`);
          return res.type('text/xml').send(`<?xml version="1.0" encoding="utf-8" ?><rsp stat="ok"><user id="${id}" /></rsp>`);
        } catch (err) {
          this.logger.error('Error while inserting new user', err);
          return res.type('text/xml').send(`<?xml version="1.0" encoding="utf-8" ?><rsp stat="fail"><err code="4" msg="Database error" /></rsp>`);
        }
      }
    });

    await this.#app.listen({ host: process.env.WEB_HOST, port: process.env.WEB_PORT });
    this.logger.info(`Web server listening on ${process.env.WEB_HOST}:${process.env.WEB_PORT}.`)

    process.on('SIGINT', async () => { await this.#app.close(); process.exit(); });
    process.on('SIGTERM', async () => { await this.#app.close(); process.exit(); })
  }
}