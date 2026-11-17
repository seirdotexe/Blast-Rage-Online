export default {
  opcode: '03',
  /**
   * Handle the join room packet
   * @param params
   * @param client
   */
  callback(params: string, client: Client) {
    const room: Room | undefined = client.server.roomManager.get(params);

    // Client is joining a room they're already in
    if (client?.room?.name === params) return;
    // Client is joining a room that doesn't exist
    if (!room) return client.send('0946');
    // Client is joining a room that's full
    if (room.full) return client.send('0945');

    room.add(client);
    // Todo - Handshake
  }
}