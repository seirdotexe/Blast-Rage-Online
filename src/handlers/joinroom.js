export default {
  opcode: '03',
  /**
   * Handle the join room packet
   * @param {string} params
   * @param {Client} client
   */
  async callback(params, client) {
    const room = client.server.roomManager.get(params);
  }
}