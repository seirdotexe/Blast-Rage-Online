declare namespace NodeJS {
  interface ProcessEnv {
    WEB_HOST: string;
    WEB_PORT: number;
    GAME_HOST: string;
    GAME_PORT: number;
    GAME_POLICY: string;
    GEAR_ITEMS: string;
    GEAR_SHIPS: string;
    NODE_ENV: 'development' | 'production';
    PROCESS_TITLE: string;
    VERSION: string;
  }
}