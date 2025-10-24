// noinspection ES6PreferShortImport

import {IpcHandler} from "../../types/ipc.ts";
import {IpcChannelMap} from "../IpcChannelMap.ts";
import {STORE_CHANNELS} from "../channels/store.ts";
import {getStoreManager, StoreManager} from "../../store/StoreManager.ts";

export class StoreHandlers {
    private readonly storeManager: StoreManager;

    constructor() {
        this.storeManager = getStoreManager();
    }

    /**
     * Returns the IPC handler for fetching a value from the store.
     *
     * The handler listens on the `STORE_CHANNELS.GET` channel and retrieves the value
     * associated with the given key, using an optional default value if the key does not exist.
     *
     * @returns The IPC handler for the GET operation.
     */
    public getHandler(): IpcHandler {
        return {
            channel: STORE_CHANNELS.GET,
            operation: 'handle',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof STORE_CHANNELS.GET]['return'] => {
                const [key, defaultValue] = args;
                return this.storeManager.get(key as string, defaultValue);
            }
        };
    }

    /**
     * Returns the IPC handler for setting a value in the store.
     *
     * The handler listens on the `STORE_CHANNELS.SET` channel and stores the given key-value pair.
     *
     * @returns The IPC handler for the SET operation.
     */
    public setHandler(): IpcHandler {
        return {
            channel: STORE_CHANNELS.SET,
            operation: 'on',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof STORE_CHANNELS.SET]['return'] => {
                const [key, value] = args;
                this.storeManager.set(key as string, value);
            }
        };
    }

    /**
     * Returns the IPC handler for deleting a value from the store.
     *
     * The handler listens on the `STORE_CHANNELS.DELETE` channel and removes the value
     * associated with the specified key from the store.
     *
     * @returns The IPC handler for the DELETE operation.
     */
    public deleteHandler(): IpcHandler {
        return {
            channel: STORE_CHANNELS.DELETE,
            operation: 'on',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof STORE_CHANNELS.DELETE]['return'] => {
                const [key] = args;
                this.storeManager.delete(key as string);
            }
        };
    }

    /**
     * Returns the IPC handler for resetting the entire store.
     *
     * The handler listens on the `STORE_CHANNELS.RESET` channel and clears all stored data.
     *
     * @returns The IPC handler for the RESET operation.
     */
    public resetHandler(): IpcHandler {
        return {
            channel: STORE_CHANNELS.RESET,
            operation: 'on',
            handler: (): IpcChannelMap[typeof STORE_CHANNELS.RESET]['return'] =>
                this.storeManager.reset()
        };
    }
}
