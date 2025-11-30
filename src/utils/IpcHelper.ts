import {IpcRenderer} from 'electron';
import {IPC_CHANNELS} from "@/constants/ipc.enum.ts";
import {LOG_MODULE_NAME} from "@/constants/log.enum.ts";

/**
 * Helper class for interacting with Electron's IPC (Inter-Process Communication) system.
 * Provides utility methods for sending, receiving, and handling IPC messages.
 */
export class IpcHelper {
    /**
     * Sends an IPC request to the main process and returns a promise with the response.
     *
     * This method is used to request data or perform actions asynchronously from the main process.
     * The main process must handle this request and send a response back.
     *
     * @param channel - The channel to send the request to.
     * @param omit - Any additional arguments to send along with the request.
     * @returns A promise that resolves to the response from the main process.
     */
    public static request(channel: string, ...omit: unknown[]): Promise<unknown> {
        this.debug(`Making a request to the IPC channel '${channel}'.`);

        return window.ipcRenderer.invoke(channel, ...omit);
    }

    /**
     * Sends an IPC message to the main process without expecting a response.
     *
     * This method is used to emit messages to the main process without waiting for a response.
     * The main process can perform actions based on the message, but no response is required.
     *
     * @param channel - The channel to send the message to.
     * @param omit - Any additional arguments to send with the message.
     */
    public static emit(channel: string, ...omit: unknown[]): void {
        this.debug(`Sending a message to the IPC channel '${channel}'.`);

        window.ipcRenderer.send(channel, ...omit);
    }

    /**
     * Listens for messages from the main process on the specified channel and executes the callback function when a message is received.
     *
     * This method subscribes to a specific IPC channel and listens for any messages sent from the main process.
     * The provided callback function will be invoked whenever a message is received on that channel.
     *
     * @param channel - The channel to listen on.
     * @param callback - The callback function to be executed when a message is received.
     * @returns The `IpcRenderer` instance to allow chaining.
     */
    public static listen<T extends unknown[] = unknown[]>(
        channel: string,
        callback: (event: Electron.IpcRendererEvent, ...args: T) => void
    ): IpcRenderer {
        this.debug(`IPC channel '${channel}' has started listening.`);

        return window.ipcRenderer.on(channel, callback);
    }

    /**
     * Listens for a message from the main process on the specified channel and executes the callback function only once.
     *
     * This method is similar to `listen`, but it only triggers the callback once, then automatically removes the listener after it's called.
     *
     * @param channel - The channel to listen on.
     * @param callback - The callback function to be executed when a message is received.
     * @returns The `IpcRenderer` instance to allow chaining.
     */
    public static listenOnce<T extends unknown[] = unknown[]>(
        channel: string,
        callback: (event: Electron.IpcRendererEvent, ...args: T) => void
    ): IpcRenderer {
        this.debug(`IPC channel '${channel}' has started listening. [ONCE]`);

        return window.ipcRenderer.once(channel, callback);
    }

    /**
     * Removes a specific listener from a channel.
     *
     * This method removes a listener that was previously added using `listen` or `listenOnce`.
     *
     * @param channel - The channel to remove the listener from.
     * @param omit - The listener function to be removed.
     * @returns The `IpcRenderer` instance to allow chaining.
     */
    public static removeListener<T extends unknown[] = unknown[]>(
        channel: string,
        ...omit: [listener: (event: Electron.IpcRendererEvent, ...args: T) => void]
    ): IpcRenderer {
        this.debug(`IPC channel '${channel}' has stopped listening.`);

        return window.ipcRenderer.off(channel, ...omit);
    }

    /**
     * Removes all listeners from a specific channel.
     *
     * This method removes all listeners associated with a given channel.
     * It is useful when you want to stop listening to a channel entirely.
     *
     * @param channel - The channel to remove all listeners from.
     * @returns The `IpcRenderer` instance to allow chaining.
     */
    public static removeAllListener(channel: string): IpcRenderer {
        this.debug(`All listeners for the IPC channel '${channel}' have been removed.`);

        return window.ipcRenderer.removeAllListeners(channel);
    }

    /**
     * Sends a debug message to the main process.
     *
     * This method is used internally to log messages about the current IPC actions.
     *
     * @param msg - The debug message to send.
     */
    private static debug(msg: string) {
        window.ipcRenderer.send(
            IPC_CHANNELS.LOGGER.DEBUG,
            LOG_MODULE_NAME.IPC,
            msg
        );
    }
}
