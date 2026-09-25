/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.createTable('ships', (table) => {
    table.increments('id').primary().comment('Unique id of this ship');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    table.integer('ship_id').unsigned().notNullable().comment('The item id of this ship');
    table.string('color1', 6).notNullable();
    table.string('color2', 6).notNullable();
    table.string('gear', 50).notNullable().comment('Includes weapons and equipment, item ids comma separated');
  });
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  return knex.schema.dropTable('ships');
}