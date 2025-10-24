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
}