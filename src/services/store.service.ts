import {IpcHandle, IpcOn, RegisterIpcHandlers} from "../decorators/ipc.decorator.ts";
import type { IpcMainEvent } from 'electron';
import {StoreManager} from "../managers/StoreManager.ts";
import {IPC_CHANNELS} from "../constants/ipc.enum.ts";

/**
 * A class that handles store-related operations for the Electron application.
 * This class provides methods to interact with a store managers, including
 * getting, setting, deleting, and resetting store data. These operations are
 * triggered via IPC channels.
 *
 * The class is decorated with `@RegisterIpcHandlers` to automatically register
 * all IPC handlers when instantiated.
 */
@RegisterIpcHandlers
export class StoreHandlers {
    /**
     * Creates an instance of the StoreHandlers class.
     *
     * @param storeManager - An instance of StoreManager that manages the actual store operations.
     */
    constructor(private storeManager: StoreManager) {
        this.storeManager = storeManager;
    }

    /**
     * Handler for the "get" store operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.STORE.GET`
     * and retrieves a value from the store based on the provided key. If the key does
     * not exist, it returns a default value.
     *
     * @param _
     * @param key - The key to look up in the store.
     * @param defaultValue - The value to return if the key does not exist in the store.
     *
     * @returns The value associated with the given key, or the default value if the key is not found.
     */
    @IpcHandle(IPC_CHANNELS.STORE.GET)
    public getHandler(_: IpcMainEvent, key: string, defaultValue: unknown): unknown {
        return this.storeManager.get(key, defaultValue);
    }

    /**
     * Handler for the "set" store operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.STORE.SET`
     * and sets a value in the store for the provided key.
     *
     * @param _
     * @param key - The key under which the value should be stored.
     * @param value - The value to store in the store under the specified key.
     */
    @IpcOn(IPC_CHANNELS.STORE.SET)
    public setHandler(_: IpcMainEvent, key: string, value: unknown): void {
        this.storeManager.set(key, value);
    }

    /**
     * Handler for the "delete" store operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.STORE.DELETE`
     * and deletes the value associated with the provided key from the store.
     *
     * @param _
     * @param key - The key whose associated value should be deleted from the store.
     */
    @IpcOn(IPC_CHANNELS.STORE.DELETE)
    public deleteHandler(_: IpcMainEvent, key: string): void {
        this.storeManager.delete(key);
    }

    /**
     * Handler for the "reset" store operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.STORE.RESET`
     * and resets the store, clearing all stored values.
     */
    @IpcOn(IPC_CHANNELS.STORE.RESET)
    public resetHandler(): void {
        this.storeManager.reset();
    }
}