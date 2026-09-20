export default {
  client: 'mysql2',
  connection: {
    host: '192.168.0.6',
    port: 3306,
    user: 'myusername',
    password: 'mypassword',
    database: 'bro'
  },
  migrations: { directory: '../migrations' },
  seeds: { directory: '../seeds' }
}