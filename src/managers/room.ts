import Room from '../system/room.ts';

export default class RoomManager {
  /** A map holding all of the rooms */
  #rooms: Map<string, Room> = new Map();

  /**
   * Creates a new room manager instance to hold rooms
   */
  constructor() { }

  /**
   * Returns the map holding all of the rooms
   * @returns The map holding all of the rooms
   */
  get rooms(): Map<string, Room> {
    return this.#rooms;
  }

  /**
   * Returns the amount of rooms
   * @returns The amount of rooms
   */
  get count(): number {
    return this.#rooms.size;
  }

  /**
   * Creates a room
   * @param name - The name of the room
   */
  create(name: string) {
    const room: Room = new Room(name);

    this.#rooms.set(name, room);
  }

  /**
   * Removes a room
   * @param name - The name of the room to remove
   */
  remove(name: string) {
    this.#rooms.delete(name);
  }

  /**
   * Returns a room by its name
   * @param name - The name of the room to retrieve
   * @returns The room
   */
  get(name: string): Room | undefined {
    return this.#rooms.get(name);
  }
}