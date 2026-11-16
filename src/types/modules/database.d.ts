import type { Knex } from 'knex';

declare global {
  type IDatabase = Knex;
  type KnexFile = Knex.Config;
  type KnexRaw = Knex.Raw;
}