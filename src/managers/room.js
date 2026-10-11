import Room from '../system/room.js';

export default class RoomManager {
  /**
   * A map holding all of the rooms
   * @private
   * @type {Map<string, Room>}
   */
  #rooms = new Map();

  /**
   * Creates a new room manager instance to hold rooms
   */
  constructor() { }

  /**
   * Returns the map holding all of the rooms
   * @returns {Map<string, Room>} The map holding all of the rooms
   */
  get rooms() {
    return this.#rooms;
  }

  /**
   * Returns the amount of rooms
   * @returns {number} The amount of rooms
   */
  get count() {
    return this.#rooms.size;
  }

  /**
   * Creates a room
   * @param {string} name - The name of the room
   */
  create(name) {
    const room = new Room(name);

    this.#rooms.set(name, room);
  }

  /**
   * Removes a room
   * @param {string} name - The name of the room to remove
   */
  remove(name) {
    this.#rooms.delete(name);
  }

  /**
   * Returns a room by its name
   * @param {string} name - The name of the room to retrieve
   * @returns {Room} The room
   */
  get(name) {
    return this.#rooms.get(name);
  }
}