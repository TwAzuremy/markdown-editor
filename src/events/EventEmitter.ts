import {EventCallback} from "@/types/event.type.ts";

/**
 * EventEmitter is a class that allows subscribing to, unsubscribing from, and emitting events.
 * It manages event listeners and facilitates event-based communication in applications.
 */
export class EventEmitter {
    private listeners: Map<string, EventCallback[]> = new Map();

    /**
     * Subscribes to an event by adding a callback function to be invoked when the event is emitted.
     *
     * @param event - The name of the event to subscribe to.
     * @param callback - The function to call when the event is emitted.
     */
    public on(event: string, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    /**
     * Unsubscribes from an event by removing a specific callback function.
     *
     * @param event - The name of the event to unsubscribe from.
     * @param callback - The callback function to remove.
     */
    public off(event: string, callback: EventCallback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Emits an event, triggering all subscribed callback functions with the provided arguments.
     *
     * @param event - The name of the event to emit.
     * @param args - The arguments to pass to the callback functions.
     */
    public emit(event: string, ...args: unknown[]) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(...args));
        }
    }
}
