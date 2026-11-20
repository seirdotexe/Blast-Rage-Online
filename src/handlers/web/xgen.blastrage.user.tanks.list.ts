export default {
  method: 'xgen.blastrage.user.tanks.list',
  /**
   * Handle the user tanks list HTTP call
   * @param req - The Fastify request object
   * @param res - The Fastify reply object
   */
  async callback(req: FastifyRequest, res: FastifyReply) {
    const { user_id } = req.query as { user_id?: number };
    const ships: string = (await req.server.database('ships').select('id', 'ship_id', 'color1', 'color2', 'gear').where('user_id', user_id))
      .map(({ id, ship_id, color1, color2, gear }) => `${id},${ship_id},${color1},${color2},${gear}`).join('\r');

    if (!ships) throw Object.assign(new Error('Unknown user id'), { code: 'ER_UNK_ENTRY' });

    return res.send(ships);
  }
}