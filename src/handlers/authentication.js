import { verify } from '../utils/scrypt.js';

export default {
  opcode: '09',
  /**
   * Handle the authentication packet
   * @param {string} params
   * @param {Client} client
   */
  async callback(params, client) {
    const [username, password] = params.split(';');
    /** @type {UserObj} */ const userObj = await client.database('users').first().where({ username });

    // Incorrect Username/Password combination
    if (!userObj) return client.send('09');
    // User is banned
    if (userObj.banned) return client.send('091');
    // Duplicate login
    if (client.server.clientManager.online(userObj.id)) return client.send('095');
    // Server is full - Bad game version will show
    if (client.server.clientManager.count >= 999) return client.send('09b');

    client.logger.verbose(`Handling login for ${username}`);

    const correctPassword = await verify(password, userObj.password);
    if (!correctPassword) return client.send('09');

    await client.setClient(userObj);
    client.send(`A${client.mmochaId}${client.username}|${client.current_bits_balance}|${client.total_bits_earned}|${client.xcash}|${client.id}`);
  }
}