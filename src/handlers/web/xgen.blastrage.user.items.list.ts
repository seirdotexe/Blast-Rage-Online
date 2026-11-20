export default {
  method: 'xgen.blastrage.user.items.list',
  /**
   * Handle the user items list HTTP call
   * @param req - The Fastify request object
   * @param res - The Fastify reply object
   */
  async callback(req: FastifyRequest, res: FastifyReply) {
    const { user_id } = req.query as { user_id?: number };
    const inventory: string = (await req.server.database('users').first().select('inventory').where('id', user_id))?.inventory;

    if (!inventory) throw Object.assign(new Error('Unknown user id'), { code: 'ER_UNK_ENTRY' });

    return res.send(inventory.replaceAll('|', '\r'));
  }
}