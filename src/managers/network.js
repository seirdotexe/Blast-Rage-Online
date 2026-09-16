export default class NetworkManager {
  /**
   * Creates a new network manager instance to guide traffic to the right handler function
   */
  constructor() {

  }

  /**
   * Handle incoming data from the client to the server
   * @param {string} data - The data string from Flash XML socket
   * @param {Client} client - The client sending this data to our server
   */
  handleData(data, client) {
    try {
      if (data === '<policy-file-request/>') {
        return client.send(`<cross-domain-policy><allow-access-from domain='*' to-ports='*' /></cross-domain-policy>`);
      }

      console.log(data);
    } catch (err) {
      client.server.logger.error('Incoming data error', err);
    }
  }
}