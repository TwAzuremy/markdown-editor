import {useCallback, useRef} from "react";

/**
 * A custom React hook to handle `requestAnimationFrame` with start, cancel, and delay support.
 * It provides a way to run animations or repetitive tasks in sync with the browser's frame rate,
 * with the added ability to cancel and delay the execution of the callback function.
 *
 * @returns An object containing two functions:
 *   - `start(callback: () => void, delay: number)`: Starts the animation loop. The `callback` is executed
 *     after the specified `delay` (in milliseconds).
 *   - `cancel()`: Cancels the current animation frame loop if running.
 */
export function useAnimationFrame() {
    // Stores the requestAnimationFrame ID
    const requestRef = useRef<number | undefined>(undefined);
    // Stores the start time of the animation
    const startTimeRef = useRef<number | undefined>(undefined);

    /**
     * Cancels the current animation frame loop.
     * It will stop the ongoing animation frame and reset internal state.
     */
    const cancel = useCallback(() => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            // Reset the state
            requestRef.current = startTimeRef.current = undefined;
        }
    }, []);

    /**
     * Starts the animation frame loop with an optional delay.
     * The provided `callback` function will be executed after the specified delay.
     * After the `callback` execution, the loop will automatically stop.
     *
     * @param {Function} callback - The function to be executed when the delay is met.
     * @param {number} delay - The delay (in milliseconds) before executing the callback.
     */
    const start = useCallback((callback: () => void, delay: number) => {
        // First, cancel any existing animation frame
        cancel();

        const animate = (time: number) => {
            // Initialize the start time on the first frame
            if (!startTimeRef.current) {
                startTimeRef.current = time;
            }

            // Check if the delay time has passed
            if (time - startTimeRef.current >= delay) {
                callback();
                // Stop the animation after executing the callback
                cancel();
            } else {
                // Continue to the next frame
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        // Start the animation frame loop
        requestRef.current = requestAnimationFrame(animate);
    }, [cancel]);

    return {start, cancel};
};
