export default {
  opcode: '09',
  /**
   * Handle the login packet
   * @param {string} params
   * @param {Client} client
   */
  callback(params, client) {
    const [username, password] = params.split(';');

    client.server.logger.verbose(`Handling login for ${username}`);
  }
}