/**
 * --- ENV
 * @typedef {object} NodeJS.ProcessEnv
 * Web server settings
 * @property {string} WEB_HOST
 * @property {number} WEB_PORT
 * Game server settings
 * @property {string} GAME_HOST
 * @property {number} GAME_PORT
 * @property {string} GAME_POLICY
 * Internal
 * @property {'development'|'production'} NODE_ENV
 * @property {string} PROCESS_TITLE
 * @property {string} VERSION
 * --- General purpose
 * @typedef {object} ILogger
 * @property {(msg:string)=>void} error
 * @property {(msg:string)=>void} warn
 * @property {(msg:string)=>void} info
 * @property {(msg:string)=>void} verbose
 *
 * @typedef {object} IHandler
 * @property {number} opcode
 * @property {(params: string, client: Client) => void | Promise<void>} callback
 * --- Types / Internal
 * @typedef {import('../client.js').default} Client
 * @typedef {import('../game.js').default} GameServer
 * --- Types / External
 * @typedef {import('node:net').Socket} Socket
 * @typedef {import('knex').Knex} Database
 */