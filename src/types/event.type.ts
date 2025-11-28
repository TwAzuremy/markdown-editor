/**
 * Represents a callback function that is executed when an event is emitted.
 * It can accept any number of arguments of any type.
 *
 * @param args - The arguments passed to the callback when the event is emitted.
 */
export type EventCallback = (...args: unknown[]) => void;

/**
 * Defines the interface for an EventEmitter, which allows subscribing to, unsubscribing from, and emitting events.
 */
export type EventEmitter = {
    /**
     * Subscribes to an event by adding a callback function.
     *
     * @param event - The name of the event to subscribe to.
     * @param callback - The function to execute when the event is emitted.
     */
    on(event: string, callback: EventCallback): void;

    /**
     * Unsubscribes from an event by removing a specific callback function.
     *
     * @param event - The name of the event to unsubscribe from.
     * @param callback - The callback function to remove from the event.
     */
    off(event: string, callback: EventCallback): void;

    /**
     * Emits an event, invoking all the subscribed callback functions with the provided arguments.
     *
     * @param event - The name of the event to emit.
     * @param args - The arguments to pass to each callback function.
     */
    emit(event: string, ...args: unknown[]): void;
}
