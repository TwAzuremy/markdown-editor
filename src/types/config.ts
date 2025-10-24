/**
 * A schema representing a store, where each key is a string and the associated value is of any type.
 *
 * This interface can be used for flexible data storage where the structure is not predefined and can vary.
 *
 * @interface StoreSchema
 */
export interface StoreSchema {
    [key: string]: unknown;
}

/**
 * Represents the bounds of a window on the screen, including its width, height, and position.
 *
 * @interface WindowBounds
 * @property {number} width - The width of the window in pixels.
 * @property {number} height - The height of the window in pixels.
 * @property {number} x - The horizontal position of the window's top-left corner (X-coordinate) in pixels.
 * @property {number} y - The vertical position of the window's top-left corner (Y-coordinate) in pixels.
 */
export interface WindowBounds {
    width: number;
    height: number;
    x: number;
    y: number;
}
