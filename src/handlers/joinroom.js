export default {
  opcode: '03',
  /**
   * Handle the join room packet
   * @param {string} params
   * @param {Client} client
   */
  async callback(params, client) {
    const room = client.server.roomManager.get(params);

    // Client is joining a room they're already in
    if (client?.room?.name === params) return;
    // Client is joining a room that doesn't exist
    if (!room) return client.send('0946');
    // Client is joining a room that's full
    if (room.full) return client.send('0945');

    room.add(client);
    client.logger.verbose(`Client ${client.id} joined room ${room.name}`);
    // Todo from room system - Send message?
  }
}
