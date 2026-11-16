export default class ClientManager {
  /** The minimum value of a mmocha id */
  static readonly #MMOCHA_ID_MIN: number = 100;
  /** The maximum value of a mmocha id */
  static readonly #MMOCHA_ID_MAX: number = 999;

  /** A map holding all of the clients who have logged in */
  #clients: Map<number, Client> = new Map();
  /** A set holding all of the pending clients who haven't logged in yet */
  #pending: Set<Client> = new Set();
  /** An array holding all of the available mmocha id's */
  #availableMmochaIds: number[] = Array.from({ length: ClientManager.#MMOCHA_ID_MAX - ClientManager.#MMOCHA_ID_MIN + 1 }, (_, i) => ClientManager.#MMOCHA_ID_MIN + i).reverse();

  /**
   * Creates a new client manager instance to hold connected clients
   */
  constructor() { }

  /**
   * Returns the map holding all of the clients
   * @returns The map holding all of the clients
   */
  get clients(): Map<number, Client> {
    return this.clients;
  }

  /**
   * Returns the amount of clients
   * @returns The amount of clients
   */
  get count(): number {
    return this.#clients.size;
  }

  /**
   * Adds a client
   * @param client - The client to add
   */
  add(client: Client) {
    if (client?.id) {
      client.mmochaId = this.#availableMmochaIds.pop();

      this.#pending.delete(client);
      this.#clients.set(client.id, client);
    } else {
      this.#pending.add(client);
    }
  }

  /**
   * Removes a client
   * @param client - The client to remove
   */
  remove(client: Client) {
    if (client.mmochaId !== undefined) this.#availableMmochaIds.push(client.mmochaId);

    this.#pending.delete(client);
    this.#clients.delete(client?.id);
  }

  /**
   * Returns a client by their id
   * @param id - The id of the client to retrieve
   * @returns The client
   */
  get(id: number): Client | undefined {
    return this.#clients.get(id);
  }

  /**
   * Returns whether a client is online or not
   * @param id - The id of the client to check
   * @returns Whether or not the client is online
   */
  online(id: number): boolean {
    return this.#clients.has(id);
  }
}