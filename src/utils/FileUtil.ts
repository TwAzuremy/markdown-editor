import {promises as fs} from 'fs';

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
            const stats = await fs.stat(folderPath);
            return stats.isDirectory();
        } catch (error) {
            if (!autoCreate) return false;

            // If automatic folder creation is enabled.
            try {
                await fs.mkdir(folderPath, {recursive: true});
                return true;
            } catch (mkdirError) {
                return false;
            }
        }
    }
}

export default FileUtil;