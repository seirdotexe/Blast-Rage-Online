import Caesar from '../utils/caesar.ts';

export default class Client {
  /** The clients socket object */
  #socket: NetSocket;
  /** The game server object */
  server: GameServer;
  /** The logger instance */
  logger: ILogger;
  /** The database instance */
  database: IDatabase;

  //! Client properties
  id!: number;
  username!: string;
  current_bits_balance!: number;
  total_bits_earned!: number;
  xcash!: number;
  moderator!: boolean;
  //! Client states
  mmochaId?: number | undefined;
  room?: Room | undefined;

  /**
   * Creates a new client containing all player logic
   * @param socket - The TCP socket
   * @param server - The game server instance
   */
  constructor(socket: NetSocket, server: GameServer) {
    this.#socket = socket;
    this.server = server;
    this.logger = server.logger;
    this.database = server.database;
  }

  /**
   * Sets the client from the retrieved database user object
   * @param userObj - The retrieved database user object of this client
   */
  async setClient(userObj: UserObj) {
    this.id = userObj.id;
    this.username = userObj.username;
    this.current_bits_balance = userObj.current_bits_balance;
    this.total_bits_earned = userObj.total_bits_earned;
    this.xcash = userObj.xcash;
    this.moderator = userObj.moderator;

    this.server.clientManager.add(this);
    this.logger = this.logger.child({ clientId: `(uid=${this.id},mid=${this.mmochaId})` });

    await this.updateColumn('last_login', this.database.fn.now());
  }

  /**
   * Updates a column of the client in the database's users table
   * @param column - The column
   * @param value - The value
   */
  async updateColumn(column: string, value: boolean | string | number | KnexRaw) {
    try {
      await this.database('users').update(column, value).where('id', this.id);
    } catch (err) {
      this.logger.error('Error while updating column', err);
    }
  }

  /**
   * Sends data to the client
   * @param data - The data to send to the client
   * @param encode [default=false] - If the data of this packet should be encoded
   * @param log [default=true] - If the data should be logged
   */
  send(data: string, encode: boolean = false, log: boolean = true) {
    if (this.#socket?.writable) {
      if (log) this.logger.info(`Outgoing unicast data ${JSON.stringify(data)}`);
      this.#socket.write(`${encode ? Caesar.encodePacket(data) : data}\0`);
    }
  }

  /**
   * Disconnects the client
   */
  disconnect() {
    if (this.#socket.destroyed) return;

    this?.room?.remove(this);
    this.server.clientManager.remove(this);
    this.#socket.end();
  }
}