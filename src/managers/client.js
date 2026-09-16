export default class ClientManager {
  /**
   * A map holding all of the clients
   * @private
   * @type {Map<number, Client>}
   */
  #clients;

  /**
   * Creates a new client manager instance
   */
  constructor() {
    this.#clients = new Map();
  }

  /**
   * Returns the map holding all of the clients
   * @returns {Client} The map holding all of the clients
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
    this.#clients.set(client.id, client);
  }

  /**
   * Removes a client
   * @param {Client} client - The client to remove
   */
  remove(client) {
    this.#clients.delete(client.id);
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