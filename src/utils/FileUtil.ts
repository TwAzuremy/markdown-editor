import fs from 'fs';
import {logger} from "../main/main.ts";

class FileUtil {
    /**
     * Checks if a folder exists and can optionally create it if not.
     * @param folderPath The path of the folder to check.
     * @param autoCreate A boolean indicating whether to automatically create the folder if it does not exist. Defaults to `false`.
     * @returns A promise that resolves to a boolean:
     * - `true` if the folder exists or was successfully created.
     * - `false` if the folder does not exist and could not be created.
     */
    public static async checkFolderExists(
        folderPath: string,
        autoCreate: boolean = false
    ): Promise<boolean> {
        try {
            const stats = await fs.promises.stat(folderPath);
            return stats.isDirectory();
        } catch (error) {
            if (!autoCreate) return false;

            // If automatic folder creation is enabled.
            try {
                await fs.promises.mkdir(folderPath, {recursive: true});
                return true;
            } catch (mkdirError) {
                return false;
            }
        }
    }

    /**
     * Reads the content of a file asynchronously.
     *
     * This method attempts to read the file at the specified `filepath` using the provided encoding.
     * If the file does not exist or an error occurs during reading, it returns `null`.
     *
     * @param filepath - The path to the file to be read.
     * @param encoding - The encoding to use when reading the file. Defaults to `'utf-8'`.
     * @returns A promise that resolves to the content of the file as a string, or `null` if the file does not exist or an error occurs.
     */
    public static async readFile(
        filepath: string,
        encoding: BufferEncoding = 'utf-8'
    ): Promise<string | null> {
        try {
            // Directly attempt to read the file - no need to check existence separately
            return await fs.promises.readFile(filepath, encoding);
        } catch (error) {
            // Check if error is because file doesn't exist
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return null;
            }

            logger.error(`Error reading file '${filepath}'`, error);
            return null;
        }
    }

    /**
     * Reads the content of a JSON file asynchronously and parses it into an object.
     *
     * This method reads a JSON file from the specified path and attempts to parse its content into
     * a JavaScript object. If the file does not exist, or if an error occurs while reading or parsing,
     * it returns `null`.
     *
     * @param filepath - The path to the JSON file to be read.
     * @param encoding - The encoding to use when reading the file. Defaults to `'utf-8'`.
     * @returns A promise that resolves to the parsed JSON object, or `null` if the file does not exist or an error occurs.
     */
    public static async readJson<T = unknown>(
        filepath: string,
        encoding: BufferEncoding = 'utf-8'
    ): Promise<T | null> {
        try {
            const content = await FileUtil.readFile(filepath, encoding);

            // If file content is available, parse and return it as JSON.
            return content ? JSON.parse(content) : null;
        } catch (error) {
            logger.error(`Error reading JSON file: '${filepath}'`, error);
            return null;
        }
    }
}

export default FileUtil;