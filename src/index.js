import GameServer from './game.js';
import KnexDatabase from './system/database.js';
import WebServer from './web.js';

process.title = `${process.pid}-${process.env.PROCESS_TITLE}`;

const database = KnexDatabase;
const gameServer = new GameServer(database);
const webServer = new WebServer(database);

await Promise.all([webServer.start(), gameServer.start()]);