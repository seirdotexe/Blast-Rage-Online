export default class Caesar {
  /** The game's custom 64-character alphabet. Index 0-63 are used to encode integer values and represent the characters used by the game's packet protocol */
  static readonly #SINGLE_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-=';
  /** The cipher uses this 128-character string for character shifting, allowing shifted characters to continue past index 63 without wrapping */
  static readonly #DOUBLE_ALPHABET: string = `${this.#SINGLE_ALPHABET}${this.#SINGLE_ALPHABET}`;

  /**
   * Encodes a packet
   * @param packet - The packet to encode
   * @returns The encoded packet
   */
  static encodePacket(packet: string): string {
    if ((packet[0] === '0') || packet.startsWith('<cross-domain-policy>')) return packet;

    let shiftAmount: number = Math.floor(Math.random() * 60);

    // The cipher avoids a shift that would turn the first packet character into '0'
    while (this.shiftCharacters(packet.charAt(0), shiftAmount) === '0') {
      shiftAmount = Math.floor(Math.random() * 60);
    }

    // First character = encoded shift amount, the remaining characters = shifted packet
    return (this.encodeInteger(shiftAmount, 1) + this.shiftCharacters(packet, shiftAmount));
  }

  /**
   * Decodes a packet
   * @param packet - The packet to decode
   * @returns The decoded packet
   */
  static decodePacket(packet: string): string {
    if (packet[0] === '0') return packet;

    // The first character stores the Caesar shift amount
    const shiftAmount: number = this.decodeInteger(packet.charAt(0));

    // Remove the shift character and reverse the obfuscation
    return this.unshiftCharacters(packet.slice(1), shiftAmount);
  }

  /**
   * Encode an integer into the game's custom base-64 representation.
   * Each character represents 6 bits of the integer
   * @alias _SafeStr_106
   * @param value - The integer to encode
   * @param length - The number of 6-bit characters to produce
   * @returns The encoded value
   */
  static encodeInteger(value: number, length: number): string {
    let result: string = '';

    while (length > 0) {
      result += this.#SINGLE_ALPHABET.charAt((value >> (length - 1) * 6 & 0x3F) % this.#SINGLE_ALPHABET.length);
      length--;
    }

    return result;
  }

  /**
   * Decode an integer from the game's custom base-64 representation
   * @alias _SafeStr_115
   * @param value - The encoded integer
   * @returns The decoded integer
   */
  static decodeInteger(value: string): number {
    let result: number = 0;

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
   * @param packet - The string to shift
   * @param shiftAmount - The amount of positions to shift
   * @returns The shifted (obfuscated) string
   */
  static shiftCharacters(packet: string, shiftAmount: number): string {
    let result: string = '';

    for (let i = 0; i < packet.length; i++) {
      result += this.#DOUBLE_ALPHABET.charAt(this.#SINGLE_ALPHABET.indexOf(packet.charAt(i)) + shiftAmount);
    }

    return result;
  }

  /**
   * Reverses the Caesar character shift.
   * This performs the inverse operation used to recover the original packet
   * @alias _SafeStr_1205
   * @param packet - The shifted packet
   * @param shiftAmount - The amount of positions to shift backwards
   * @returns The unshifted (original) string
   */
  static unshiftCharacters(packet: string, shiftAmount: number): string {
    if (shiftAmount === 0) return packet;

    let result: string = '';

    for (let i = 0; i < packet.length; i++) {
      result += this.#DOUBLE_ALPHABET.charAt(this.#DOUBLE_ALPHABET.lastIndexOf(packet.charAt(i)) - shiftAmount);
    }

    return result;
  }
}