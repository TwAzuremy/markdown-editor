import {IPC_CHANNELS} from "@/constants/ipc.enum.ts";

/**
 * Utility class for interacting with a data store through IPC (Inter-Process Communication).
 * Provides methods to get, set, delete, and reset store values.
 *
 * This class allows interaction with the store via the IPC renderer, facilitating asynchronous operations
 * for storing, retrieving, and managing configuration data.
 */
export class ConfigProxy {
    /**
     * Fetches a value from the store by the given key.
     *
     * This method sends a request to fetch the value associated with the specified key. If the key is not
     * found in the store, it will return the provided default value, or `undefined` if no default is provided.
     *
     * @param key - The key of the item to retrieve from the store.
     * @param defaultValue - An optional default value to return if the key doesn't exist.
     * @returns A promise that resolves to the value associated with the given key, or the default value if not found.
     */
    public static async get(key: string, defaultValue?: unknown): Promise<unknown> {
        return await window.ipcRenderer.fetch(IPC_CHANNELS.CONFIG.GET, key, defaultValue);
    }

    /**
     * Sets a value in the store for the given key.
     *
     * This method stores the provided value under the specified key in the data store.
     *
     * @param key - The key under which the value should be stored.
     * @param value - The value to be stored.
     */
    public static set(key: string, value: unknown): void {
        window.ipcRenderer.execute(IPC_CHANNELS.CONFIG.SET, key, value);
    }

    /**
     * Deletes the value associated with the given key from the store.
     *
     * This method removes the value stored under the specified key from the store.
     *
     * @param key - The key of the item to delete.
     */
    public static delete(key: string): void {
        // noinspection JSIgnoredPromiseFromCall
        window.ipcRenderer.execute(IPC_CHANNELS.CONFIG.DELETE, key);
    }

    /**
     * Resets the entire store, clearing all stored values.
     *
     * This method sends a command to reset the store, effectively clearing all data stored under any key.
     */
    public static reset(): void {
        window.ipcRenderer.command(IPC_CHANNELS.CONFIG.RESET);
    }
}
