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

    if (!userObj) return client.send('09');
    if (userObj.banned) return client.send('091');
    if (client.server.clientManager.online(userObj.id)) return client.send('095');

    try {
      client.logger.verbose(`Handling login for ${username}`);

      const correctPassword = await verify(password, userObj.password);
      if (!correctPassword) return client.send('09');

      await client.setClient(userObj);

      // Todo - Send packet
    } catch (err) {
      client.logger.error('Error while handling authentication', err);
    }
  }
}