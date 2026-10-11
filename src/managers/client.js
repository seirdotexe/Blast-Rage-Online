export default class ClientManager {
  /**
   * The minimum value of a mmocha id
   * @private
   * @type {number}
   */
  static #MMOCHA_ID_MIN = 100;
  /**
   * The maximum value of a mmocha id
   * @private
   * @type {number}
   */
  static #MMOCHA_ID_MAX = 999;

  /**
   * A map holding all of the clients who have logged in
   * @private
   * @type {Map<number, Client>}
   */
  #clients = new Map();
  /**
   * A set holding all of the pending clients who haven't logged in yet
   * @private
   * @type {Set<Client>}
   */
  #pending = new Set();
  /**
   * An array holding all of the available mmocha id's
   * @private
   * @type {number[]}
   */
  #availableMmochaIds = Array.from({ length: ClientManager.#MMOCHA_ID_MAX - ClientManager.#MMOCHA_ID_MIN + 1 }, (_, i) => ClientManager.#MMOCHA_ID_MIN + i).reverse();

  /**
   * Creates a new client manager instance to hold connected clients
   */
  constructor() { }

  /**
   * Returns the map holding all of the clients
   * @returns {Map<number, Client>} The map holding all of the clients
   */
  get clients() {
    return this.#clients;
  }

  /**
   * Returns the amount of clients
   * @returns {number} The amount of clients
   */
  get count() {
    return this.#clients.size;
  }

  /**
   * Adds a client
   * @param {Client} client - The client to add
   */
  add(client) {
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
   * @param {Client} client - The client to remove
   */
  remove(client) {
    if (client.mmochaId) this.#availableMmochaIds.push(client.mmochaId);

    this.#pending.delete(client);
    this.#clients.delete(client?.id);
  }

  /**
   * Returns a client by their id
   * @param {number} id - The id of the client to retrieve
   * @returns {Client} The client
   */
  get(id) {
    return this.#clients.get(id);
  }

  /**
   * Returns whether a client is online or not
   * @param {number} id - The id of the client to check
   * @returns {boolean} Whether or not the client is online
   */
  online(id) {
    return this.#clients.has(id);
  }
}