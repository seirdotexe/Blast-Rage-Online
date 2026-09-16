/**
 * --- ENV
 * @typedef {object} NodeJS.ProcessEnv
 * Web server settings
 * @property {string} WEB_HOST
 * @property {number} WEB_PORT
 * Game server settings
 * @property {string} GAME_HOST
 * @property {number} GAME_PORT
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
 * --- Types / Internal
 * @typedef {import('../client.js').default} Client
 * @typedef {import('../game.js').default} GameServer
 * --- Types / Node
 * @typedef {import('node:net').Socket} Socket
 */