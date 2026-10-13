export default class Room {
  /**
   * A map holding all of the clients
   * @private
   * @type {Map<number, Client>}
   */
  #clients = new Map();

  /**
   * Creates a new room containing all room logic
   * @param {string} name - The name of the room
   */
  constructor(name) {
    /**
     * The name of the room
     * @type {string}
     */
    this.name = name;
  }

  /**
   * Returns the amount of clients
   * @returns {number} The amount of clients
   */
  get count() {
    return this.#clients.size;
  }

  /**
   * Returns whether the room is full or not
   * @returns {boolean} Whether the room is full or not
   */
  get full() {
    return (this.name === '_') ? false : (this.count >= 8);
  }

  /**
   * Sends data to the clients
   * @param {string} data - The data to send to the clients
   * @param {boolean} [encode=false] - If the data of this packet should be encoded
   */
  send(data, encode = false) {
    let log = true;

    for (const client of this.#clients.values()) {
      if (log) {
        client.logger.verbose(`Outgoing multicast@${this.name} data ${JSON.stringify(data)}`);
        log = false;
      }

      client.send(data, encode, false);
    }
  }

  /**
   * Adds a client
   * @param {Client} client - The client to add
   */
  add(client) {
    client?.room?.remove(client);
    this.#clients.set(client.id, client);
    // Todo - Send message?
  }

  /**
   * Removes a client
   * @param {Client} client - The client to remove
   */
  remove(client) {
    if (this.#clients.has(client.id)) {
      client.room = undefined;

      this.#clients.delete(client.id);
      // Todo - Send message?
    }
  }
}