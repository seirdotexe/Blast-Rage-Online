export default {
  opcode: '09',
  /**
   * Handle the authentication packet
   * @param {string} params
   * @param {Client} client
   */
  callback(params, client) {
    const [username, password] = params.split(';');

    client.logger.verbose(`Handling login for ${username}`);
  }
}