import {promises as fs} from "fs";

/**
 * A utility class for reading binary files.
 *
 * This class provides methods for reading binary files and extracting specific values from them.
 *
 * Only suitable for reading key-values in the earlier part of the file.
 */
export class JsonBinaryReader {
    /**
     * Reads a binary file and attempts to extract the value associated with a specific key.
     * The method reads a portion of the file (up to `byteCount` bytes) and searches for the key
     * within this portion. If found, the corresponding string value is extracted and returned.
     *
     * @param filePath - The path to the binary file to read.
     * @param key - The key to search for within the file.
     * @param byteCount - The number of bytes to read from the start of the file (default is 200).
     *
     * @returns A Promise that resolves to the string value associated with the key,
     *          or `null` if the key is not found or reading the file fails.
     */
    public static async readKeyValue(
        filePath: string,
        key: string,
        byteCount: number = 200
    ): Promise<string | null> {
        try {
            // Read the file into a buffer
            const buffer = await fs.readFile(filePath);
            // Extract the value associated with the key from the buffer
            return this.extractKeyValue(
                buffer.subarray(0, Math.min(byteCount, buffer.length)), key);
        } catch {
            // Return null if reading the file fails
            return null;
        }
    }

    /**
     * Extracts the value associated with a specified key from a binary buffer.
     * This method finds the position of the key within the buffer and extracts the
     * corresponding string value, if available.
     *
     * @param buffer - The binary buffer to search for the key.
     * @param key - The key to search for within the buffer.
     *
     * @returns The extracted string value if the key is found, otherwise `null`.
     */
    private static extractKeyValue(buffer: Buffer, key: string): string | null {
        // Find the position of the key in the buffer
        const keyPos = buffer.indexOf(Buffer.from(key, 'utf-8'));
        // If the key is found, extract the string value starting after the key
        return keyPos !== -1 ? this.extractStringValue(buffer, keyPos + key.length) : null;
    }

    /**
     * Extracts the string value starting from the specified position in the buffer.
     * This method handles skipping whitespace characters and looking for a quoted string, considering escape sequences.
     *
     * @param buffer - The binary buffer containing the data to extract from.
     * @param startPos - The position in the buffer to start searching for the string.
     *
     * @returns The extracted string value if found, otherwise null.
     */
    private static extractStringValue(buffer: Buffer, startPos: number): string | null {
        let pos = startPos;

        // Skip over any whitespace characters
        while (pos < buffer.length && this.isWhitespace(buffer[pos])) pos++;

        // Ensure the string starts with a double-quote (0x22 in hex)
        if (pos >= buffer.length || buffer[pos++] !== 0x22) return null;

        const valueStart = pos;

        // Search for the ending double-quote, accounting for escape sequences
        while (pos < buffer.length) {
            if (buffer[pos] === 0x22 && buffer[pos - 1] !== 0x5C) {
                // Return the string found between the quotes
                return buffer.subarray(valueStart, pos).toString('utf-8');
            }
            pos++;
        }

        // Return null if no valid string was found
        return null;
    }

    /**
     * Checks if a byte represents a whitespace character.
     * This includes space (0x20), newline (0x0A), carriage return (0x0D), and tab (0x09).
     *
     * @param byte - The byte value to check.
     *
     * @returns True if the byte is a whitespace character, otherwise false.
     */
    private static isWhitespace(byte: number): boolean {
        return byte === 0x20 || byte === 0x0A || byte === 0x0D || byte === 0x09;
    }
}