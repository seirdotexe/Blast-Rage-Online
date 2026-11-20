interface IGameHandler {
  opcode: string;
  callback: (params: string, client: Client) => void | Promise<void>;
}

interface IWebHandler {
  method: string;
  callback: (req: FastifyRequest, res: FastifyReply) => Promise<unknown> | unknown;
}