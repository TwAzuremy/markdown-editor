import {IpcMain} from "electron";
import {IpcHandler, IpcMainOperation, IpcSender} from "@/types/ipc.ts";
import {LogUtil} from "../utils/LogUtil.ts";
import {LOG_MODULE_NAME} from "../constants/log.enum.ts";

/**
 * Abstract base class for managing IPC (Inter-Process Communication) handlers and senders
 * in an Electron application. Provides centralized registration and cleanup of IPC channels.
 *
 * This class serves as a registry that coordinates the registration of IPC handlers
 * with Electron's ipcMain module and manages the lifecycle of these handlers.
 */
export abstract class IpcRegistry {
    /**
     * Retrieves all IPC handlers that should be registered with the ipcMain module.
     * Implementations must provide concrete handler definitions including channel names,
     * operation types, and handler functions.
     *
     * @abstract
     * @returns {IpcHandler[]} Array of IPC handler configurations
     */
    public abstract getHandlers(): IpcHandler[];

    /**
     * Retrieves all IPC sender configurations that define how the renderer process
     * can communicate with the main process.
     *
     * @abstract
     * @returns {IpcSender[]} Array of IPC sender configurations
     */
    public abstract getSenders(): IpcSender[];

    /**
     * Maps IPC operations to their corresponding ipcMain registration methods.
     * Provides the underlying implementation for registering different types of IPC handlers.
     *
     * @private
     */
    private readonly handlerOperations: Record<IpcMainOperation,
        (ipcMain: IpcMain, channel: string, handler: IpcHandler['handler']) => void> = {
        handle: (ipcMain: IpcMain, channel: string, handler: IpcHandler['handler']) =>
            ipcMain.handle(channel, handler),
        on: (ipcMain: IpcMain, channel: string, handler: IpcHandler['handler']) =>
            ipcMain.on(channel, handler),
        once: (ipcMain: IpcMain, channel: string, handler: IpcHandler['handler']) =>
            ipcMain.once(channel, handler)
    };

    /**
     * Maps IPC operations to their corresponding cleanup methods for unregistering handlers.
     * Ensures proper cleanup of IPC channels when the registry is unregistered.
     *
     * @private
     */
    private readonly unregisterOperations: Record<IpcMainOperation,
        (ipcMain: IpcMain, channel: string) => void> = {
        handle: (ipcMain: IpcMain, channel: string) => ipcMain.removeHandler(channel),
        on: (ipcMain: IpcMain, channel: string) => ipcMain.removeAllListeners(channel),
        once: (ipcMain: IpcMain, channel: string) => ipcMain.removeAllListeners(channel)
    };

    /**
     * Registers all IPC handlers with the provided ipcMain instance.
     * Iterates through all handlers returned by getHandlers() and registers them
     * using the appropriate operation method.
     *
     * @param {IpcMain} ipcMain - The Electron ipcMain instance to register handlers with
     */
    register(ipcMain: IpcMain): void {
        this.getHandlers().forEach(({channel, operation, handler}) => {
            const operationFn = this.handlerOperations[operation];
            if (operationFn) {
                operationFn(ipcMain, channel, handler);
                LogUtil.debug(LOG_MODULE_NAME.IPC, `'${channel}' registration successful.`);
            } else {
                LogUtil.warn(LOG_MODULE_NAME.IPC,
                    `Unsupported IPC operation: ${operation} for channel: ${channel}`);
            }
        });
    }

    /**
     * Unregisters all previously registered IPC handlers from the provided ipcMain instance.
     * Performs cleanup to remove all event listeners and handlers, preventing memory leaks
     * and ensuring proper application shutdown.
     *
     * @param {IpcMain} ipcMain - The Electron ipcMain instance to unregister handlers from
     */
    unregister(ipcMain: IpcMain): void {
        this.getHandlers().forEach(({channel, operation}) => {
            this.unregisterOperations[operation]?.(ipcMain, channel);
        });
    }
}