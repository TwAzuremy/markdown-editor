export class HtmlCssUtil {
    /**
     * Retrieves the value of a CSS custom property (CSS variable) from the root element.
     *
     * This function accesses the computed styles of the root element (`document.documentElement`)
     * and returns the value of the specified CSS variable.
     *
     * @param {string} name - The name of the CSS variable to retrieve.
     * @returns {string} - The value of the specified CSS variable, or an empty string if not found.
     */
    public static getRootVariable(name: string): string {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    /**
     * Calculates the center coordinates (x, y) of a given HTML element relative to the viewport.
     *
     * This function uses `getBoundingClientRect()` to obtain the element's position relative to the viewport,
     * and then calculates the center point by averaging the left and right, and top and bottom coordinates.
     * It also accounts for any scrolling by adding `window.scrollX` and `window.scrollY`.
     *
     * @param {HTMLElement} element - The HTML element whose center coordinates are to be calculated.
     * @returns {{x: number, y: number}} - The x and y coordinates of the center of the element relative to the viewport.
     */
    public static getElementCenter(element: HTMLElement): {x: number, y: number} {
        const rect = element.getBoundingClientRect();

        return {
            x: (rect.left + rect.right) / 2 + window.scrollX,
            y: (rect.top + rect.bottom) / 2 + window.scrollY
        };
    }
}