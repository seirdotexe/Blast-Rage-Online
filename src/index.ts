import GameServer from './game.ts';
import KnexDatabase from './system/database.ts';
import WebServer from './web.ts';

process.title = `${process.pid}-${process.env.PROCESS_TITLE}`;

const database: IDatabase = KnexDatabase;
const gameServer: GameServer = new GameServer(database);
const webServer = new WebServer(database);

const stop = async () => {
  await Promise.all([webServer.stop(), gameServer.stop()]);
  await database.destroy();
}

const start = async () => {
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);

  try {
    await Promise.all([webServer.start(), gameServer.start()]);
  } catch (err) {
    console.error('Failed to start application', err);
  }
}

await start();