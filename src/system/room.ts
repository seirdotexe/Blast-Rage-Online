export default class Room {
  /** The name of the room */
  name: string;

  /** A map holding all of the clients */
  #clients: Map<number, Client> = new Map();

  /**
   * Creates a new room containing all room logic
   * @param name - The name of the room
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Returns the amount of clients
   * @returns The amount of clients
   */
  get count(): number {
    return this.#clients.size;
  }

  /**
   * Returns whether the room is full or not
   * @returns Whether the room is full or not
   */
  get full(): boolean {
    return (this.name === '_') ? false : (this.count >= 8);
  }

  /**
   * Sends data to the clients
   * @param data - The data to send to the clients
   * @param encode [default=false] - If the data of this packet should be encoded
   */
  send(data: string, encode: boolean = false) {
    let log: boolean = true;

    for (const client of this.#clients.values()) {
      if (log) {
        client.logger.info(`Outgoing multicast@${this.name} data ${JSON.stringify(data)}`);
        log = false;
      }

      client.send(data, encode, false);
    }
  }

  /**
   * Adds a client
   * @param client - The client to add
   */
  add(client: Client) {
    client.logger.verbose(`Client joined room ${this.name}`);
    client?.room?.remove(client);
    client.room = this;

    this.#clients.set(client.id, client);
    // Todo - Send message?
  }

  /**
   * Removes a client
   * @param client - The client to remove
   */
  remove(client: Client) {
    if (this.#clients.has(client.id)) {
      client.logger.verbose(`Client left room ${this.name}`);
      client.room = undefined;

      this.#clients.delete(client.id);
      this.send(`D${client.mmochaId}`);
    }
  }
}