export default class Caesar {
  /**
   * The game's custom 64-character alphabet. Index 0-63 are used to encode integer values and represent the characters used by the game's packet protocol
   * @private
   * @type {string}
   */
  static #SINGLE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-=';
  /**
   * The cipher uses this 128-character string for character shifting, allowing shifted characters to continue past index 63 without wrapping
   * @private
   * @type {string}
   */
  static #DOUBLE_ALPHABET = `${this.#SINGLE_ALPHABET}${this.#SINGLE_ALPHABET}`;

  /**
   * Encodes a packet
   * @param {string} packet - The packet to encode
   * @returns {string} The encoded packet
   */
  static encodePacket(packet) {
    if (packet[0] === '0' || packet.startsWith('<cross-domain-policy>')) return packet;

    let shiftAmount = Math.floor(Math.random() * 60);

    // The cipher avoids a shift that would turn the first packet character into '0'
    while (this.shiftCharacters(packet[0], shiftAmount) === '0') {
      shiftAmount = Math.floor(Math.random() * 60);
    }

    // First character = encoded shift amount, the remaining characters = shifted packet
    return (this.encodeInteger(shiftAmount, 1) + this.shiftCharacters(packet, shiftAmount));
  }

  /**
   * Decodes a packet
   * @param {string} packet - The packet to decode
   * @returns {string} The decoded packet
   */
  static decodePacket(packet) {
    if (packet[0] === '0') return packet;

    // The first character stores the Caesar shift amount
    const shiftAmount = this.decodeInteger(packet[0]);

    // Remove the shift character and reverse the obfuscation
    return this.unshiftCharacters(packet.slice(1), shiftAmount);
  }

  /**
   * Encode an integer into the game's custom base-64 representation.
   * Each character represents 6 bits of the integer
   * @alias _SafeStr_106
   * @param {number} value - The integer to encode
   * @param {number} length - The number of 6-bit characters to produce
   * @returns {string} Encoded value
   */
  static encodeInteger(value, length) {
    let result = '';

    while (length > 0) {
      result += this.#SINGLE_ALPHABET.charAt((value >> (length - 1) * 6 & 0x3F) % this.#SINGLE_ALPHABET.length);
      length--;
    }

    return result;
  }

  /**
   * Decode an integer from the game's custom base-64 representation
   * @alias _SafeStr_115
   * @param {string} value - The encoded integer
   * @returns {number} The decoded integer
   */
  static decodeInteger(value) {
    let result = 0;

    for (let i = 0; i < value.length; i++) {
      result += this.#SINGLE_ALPHABET.indexOf(value.charAt(i)) << 6 * (value.length - 1 - i);
    }

    return result;
  }

  /**
   * Shift every character in a packet through the game's alphabet.
   * The character's position in the 64-character alphabet is moved by shiftAmount.
   * The duplicated alphabet is used so the cipher can access positions beyond index 63
   * @alias shift
   * @param {string} packet - The string to shift
   * @param {number} shiftAmount - The amount of positions to shift
   * @returns {string} The shifted (obfuscated) string
   */
  static shiftCharacters(packet, shiftAmount) {
    let result = '';

    for (let i = 0; i < packet.length; i++) {
      result += this.#DOUBLE_ALPHABET.charAt(this.#SINGLE_ALPHABET.indexOf(packet.charAt(i)) + shiftAmount);
    }

    return result;
  }

  /**
   * Reverses the Caesar character shift.
   * This performs the inverse operation used to recover the original packet
   * @alias _SafeStr_1205
   * @param {string} packet - The shifted packet
   * @param {number} shiftAmount - The amount of positions to shift backwards
   * @returns {string} The unshifted (original) string
   */
  static unshiftCharacters(packet, shiftAmount) {
    if (shiftAmount === 0) return packet;

    let result = '';

    for (let i = 0; i < packet.length; i++) {
      result += this.#DOUBLE_ALPHABET.charAt(this.#DOUBLE_ALPHABET.lastIndexOf(packet.charAt(i)) - shiftAmount);
    }

    return result;
  }
}