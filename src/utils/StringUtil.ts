export class StringUtil {
    /**
     * Combines multiple class names into a single string, filtering out any falsy values.
     *
     * This method takes any number of class names (strings) and combines them into one string,
     * removing any undefined, null, false, or empty values. It is useful for dynamically
     * constructing class names based on conditions.
     *
     * @param classNames - A list of class names (strings) or falsy values (undefined, null, false).
     * @returns A single string containing the non-falsy class names, separated by spaces.
     */
    public static combinedClassName(...classNames: (string | undefined | null | false)[]): string {
        return classNames.filter(Boolean).join(' ');
    }

    /**
     * Converts a string with words separated by underscores or hyphens into a space-separated string
     * where each word has its first letter capitalized (Title Case format).
     *
     * This function supports both underscore (`_`) and hyphen (`-`) as delimiters in the input string.
     * For example, "xxx_yyy" or "xxx-yyy" will be converted to "Xxx Yyy".
     *
     * @param str The input string that contains words separated by either underscores or hyphens.
     * @returns A string with words separated by spaces, and each word's first letter capitalized
     *          (e.g., "Xxx Yyy").
     */
    public static formatStringToTitleCase(str: string): string {
        if (!str) return '';

        // Use regular expression to match both underscores and hyphens as delimiters
        return str.split(/[_-]/)
            .filter(word => word.length > 0)
            // Capitalize the first letter of each word, and make the rest lowercase
            .map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');
    }

    /**
     * Converts a time string to milliseconds.
     *
     * This function parses a time string (e.g., '1s', '500ms', '0.2s') and returns the equivalent value in milliseconds.
     * If the input string doesn't match the expected format, it returns `null`.
     *
     * @param {string} timeStr - The time string to convert. It can be in the form of 's' for seconds or 'ms' for milliseconds (e.g., '1s', '500ms', '0.2s').
     * @returns {number | null} - The equivalent time in milliseconds, or `null` if the input string is invalid.
     */
    public static convertToMilliseconds(timeStr: string): number | null {
        // Use a regular expression to match the time format (seconds or milliseconds)
        const timePattern = /^(\d*\.?\d+)(s|ms)$/;
        const match = timeStr.trim().match(timePattern);

        if (!match) {
            return null;
        }

        const value = parseFloat(match[1]);
        const unit = match[2] as 's' | 'ms';

        // Convert based on the unit (seconds or milliseconds)
        if (unit === 's') {
            return value * 1000;
        } else if (unit === 'ms') {
            return value;
        }

        return null;
    }
}