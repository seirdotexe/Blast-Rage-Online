import { hash } from '../../utils/scrypt.ts';

export default {
  method: 'xgen.users.add',
  /**
   * Handle the user creation HTTP call
   * @param req - The Fastify request object
   * @param res - The Fastify reply object
   */
  async callback(req: FastifyRequest, res: FastifyReply) {
    const { username, password } = req.query as { username?: string, password?: string };

    if (!username || !password) {
      return res.status(500).type('text/plain').send('Missing parameters');
    }

    const id = await req.server.database.transaction(async (trx) => {
      const [id] = await trx('users').insert({ username, password: await hash(password), inventory: process.env.GEAR_ITEMS });

      await Promise.all(process.env.GEAR_SHIPS.split('|').map((ship) => {
        const [ship_id, color1, color2, ...gear] = ship.split(',');
        return trx('ships').insert({ user_id: id, ship_id, color1, color2, gear: gear.toString() });
      }));

      return id;
    });

    req.server.logger.info(`User ${username} with id ${id} has been registered`);
    return res.type('text/xml').send(`<rsp stat="ok"><user id="${id}" /></rsp>`);
  }
}