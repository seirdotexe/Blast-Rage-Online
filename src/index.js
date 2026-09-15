import GameServer from './game.js';
import WebServer from './web.js';

process.title = `${process.pid}-${process.env.PROCESS_TITLE}`;

const gameServer = new GameServer();
const webServer = new WebServer();

gameServer.start();
webServer.start();