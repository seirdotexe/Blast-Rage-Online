import { verify } from '../../utils/scrypt.ts';

export default {
  opcode: '09',
  /**
   * Handle the authentication packet
   * @param params
   * @param client
   */
  async callback(params: string, client: Client) {
    const [username, password] = params.split(';');
    const userObj: UserObj = await client.database('users').first().where({ username });

    // Incorrect Username/Password combination
    if (!userObj || !username || !password) return client.send('09');
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