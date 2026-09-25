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

      let packet = `A${client.mmochaId}${client.username}|${client.current_bits_balance}|${client.total_bits_earned}|${client.xcash}|${client.id}|`;
      packet += '0,1,ffd71e,262626,1,9,8\r1,2,46b013,518f08,3,9,7\r2,3,1547ff,9caff5,2,9,7';

      client.send(packet);
    } catch (err) {
      client.logger.error('Error while handling authentication', err);
    }
  }
}