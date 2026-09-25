/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary().comment('Unique id of this user');
    table.string('username', 15).unique().notNullable();
    table.string('password', 255).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('last_login').notNullable().defaultTo(knex.fn.now());
    table.integer('current_bits_balance').unsigned().notNullable().defaultTo(0);
    table.integer('total_bits_earned').unsigned().notNullable().defaultTo(0).comment('This counts as XP');
    table.integer('xcash').unsigned().notNullable().defaultTo(0);
    table.boolean('banned').notNullable().defaultTo(false);
  });
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  return knex.schema.dropTable('users');
}