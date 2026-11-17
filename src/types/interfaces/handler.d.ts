interface IGameHandler {
  opcode: string;
  callback: (params: string, client: Client) => void | Promise<void>;
}