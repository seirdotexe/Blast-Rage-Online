import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ships', (table) => {
    table.increments('id').primary().comment('Unique id of this ship');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    table.integer('ship_id').unsigned().notNullable().comment('The item id of this ship');
    table.string('color1', 6).notNullable();
    table.string('color2', 6).notNullable();
    table.string('gear', 50).notNullable().comment('All weapons and equipment of this ship, format: item ids comma separated');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ships');
}