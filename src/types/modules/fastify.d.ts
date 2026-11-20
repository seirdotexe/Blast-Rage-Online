import type { FastifyReply as Reply, FastifyRequest as Request } from 'fastify';

declare global {
  type FastifyReply = Reply;
  type FastifyRequest = Request;
}

declare module 'fastify' {
  interface FastifyInstance {
    database: IDatabase;
    logger: ILogger;
  }
}