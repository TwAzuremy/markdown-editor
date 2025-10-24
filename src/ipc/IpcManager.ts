import {IpcSenderMap} from "../types/ipc.ts";
import {ipcMain, WebContents} from "electron";
import {IpcChannelMap} from "./IpcChannelMap.ts";
import {IpcRegistry} from "../abstract/IpcRegistry.ts";
import {LogUtil} from "../utils/LogUtil.ts";
import {LOG_MODULE_NAME} from "../constants/log.enum.ts";

const logger = new LogUtil(LOG_MODULE_NAME.MAIN);

/**
 * The `IpcManager` class is responsible for managing IPC registries and senders
 * within an Electron application. It facilitates the registration and unregistration
 * of IPC handlers, as well as sending messages from the main process to the renderer
 * process.
 */
export class IpcManager {
    // Stores the list of IPC registries.
    private registries: IpcRegistry[] = [];

    // Maps IPC channels to their corresponding senders.
    private senders: Partial<IpcSenderMap> = {};

    constructor() {
    }

    /**
     * Adds an IPC registry to the `IpcManager`. This allows the manager to keep track
     * of different registries and their corresponding senders.
     *
     * @param registry - The IPC registry to add.
     */
    addRegistry(registry: IpcRegistry): void {
        this.registries.push(registry);

        // Collect all senders from the registry, if any.
        if (registry.getSenders) {
            registry.getSenders().forEach(sender => {
                this.senders[sender.channel] = sender;
            });
        }
    }

    /**
     * Registers all IPC handlers in the `registries` list with `ipcMain` (the main
     * process IPC interface). This method is typically called at the application
     * initialization stage to set up all IPC channels.
     */
    registerAll(): void {
        this.registries.forEach(registry => {
            registry.register(ipcMain);
        });

        // console.log(`Total registered ${this.registries.length} IPC registries`);
        logger.info(`Total registered ${this.registries.length} IPC registries`);
    }

    /**
     * Unregisters all IPC handlers in the `registries` list from `ipcMain`. This
     * is typically used during application shutdown or when IPC handlers need to
     * be removed.
     */
    unregisterAll(): void {
        this.registries.forEach(registry => {
            registry.unregister(ipcMain);
        });
    }

    /**
     * Sends a message from the main process to the renderer process using IPC.
     * This method checks if the appropriate sender for the given channel exists
     * and sends the message accordingly.
     *
     * @param webContents - The `WebContents` instance of the renderer process
     * (typically used to target a specific window).
     * @param channel - The channel to send the message on.
     * @param args - The arguments to pass along with the message. The arguments
     * type depends on the channel.
     *
     * @throws A warning if no sender is found for the specified channel.
     */
    send<T extends keyof IpcChannelMap>(
        webContents: WebContents,
        channel: T,
        ...args: IpcChannelMap[T]['args']
    ): void {
        const sender = this.senders[channel];
        if (sender && sender.operation === 'send') {
            sender.send(webContents, ...args);
        } else {
            logger.warn(`No sender found for channel: ${channel}`);
        }
    }
}
