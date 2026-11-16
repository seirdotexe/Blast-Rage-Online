//! Node types
type NetSocket = import('node:net').Socket;
type NetServer = import('node:net').Server;
//! Custom types
type GameServer = import('../game.ts').default;
type Client = import('../system/client.ts').default;
type Room = import('../system/room.ts').default;
type ClientUser = Omit<UserObj, 'password' | 'created_at' | 'last_login' | 'banned'>;