import { hash } from '../src/utils/scrypt.js';

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
  const password = await hash('123456');

  await knex('users').del();
  await knex('users').insert({ username: 'Seir', password });
}