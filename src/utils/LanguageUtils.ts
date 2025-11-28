import {promises as fs} from 'fs';
import path from "node:path";
import {JsonBinaryReader} from "./JsonBinaryReader.ts";
import {LanguageMap} from "@/types/language.type.ts";

/**
 * Reads all JSON files in the specified directory and extracts the display name associated with 'display.name' key.
 * The method returns a map where the keys are the file names (without the .json extension) and the values are the display names.
 *
 * @param localesPath The path to the directory containing the JSON files.
 * @returns A promise that resolves to a map containing the display names for each file.
 */
export async function getLanguageMap(localesPath: string): Promise<LanguageMap> {
    const languageMap: LanguageMap = {};

    try {
        const files = await fs.readdir(localesPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        // Process each JSON file asynchronously
        const results = await Promise.all(
            jsonFiles.map(async (file) => {
                const filePath = path.join(localesPath, file);
                const code = path.basename(file, '.json');

                try {
                    const stats = await fs.stat(filePath);
                    // Only process if it's a file (skip directories)
                    if (!stats.isFile()) return null;

                    // Attempt to extract the display name from the file content
                    const content = await
                        JsonBinaryReader.readKeyValue(filePath, '"display.name":');
                    return [code, content || code];
                } catch (error) {
                    console.warn(`Unable to process ${file}:`,
                        error instanceof Error ? error.message : String(error));
                    // Return the file name as fallback in case of error
                    return [code, code];
                }
            })
        );

        // Populate the languageMap with results
        results.forEach(result => {
            if (result) {
                const [code, name] = result;
                languageMap[code] = name;
            }
        });
    } catch (error) {
        console.error('Error reading language files:',
            error instanceof Error ? error.message : String(error));
    }

    return languageMap;
}