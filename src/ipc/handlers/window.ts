import {BrowserWindow} from "electron";
// noinspection ES6PreferShortImport
import {IpcHandler} from "../../types/ipc.ts";
import {IpcChannelMap} from "../IpcChannelMap.ts";
import {WINDOW_CHANNELS} from "../channels/window.ts";

export class WindowHandlers {
    /**
     * Constructor for the WindowHandlers class.
     * @param mainWindow The main window to handle IPC events for.
     */
    constructor(private mainWindow: BrowserWindow) {
    }

    /**
     * Minimize handler.
     * This IPC handler minimizes the window when invoked.
     * @returns An IPC handler object.
     */
    public minimizeHandler(): IpcHandler {
        return {
            channel: WINDOW_CHANNELS.MINIMIZE,
            operation: 'on',
            handler: (): IpcChannelMap[typeof WINDOW_CHANNELS.MINIMIZE]['return'] => {
                this.mainWindow.minimize();
            }
        };
    }

    /**
     * Maximize handler.
     * This IPC handler maximizes or unmaximizes the window when invoked.
     * If the window is already maximized, it unmaximizes the window.
     * If the window is not maximized, it maximizes the window.
     * @returns An IPC handler object.
     */
    public maximizeHandler(): IpcHandler {
        return {
            channel: WINDOW_CHANNELS.MAXIMIZE,
            operation: 'on',
            /**
             * IPC handler function that toggles the maximization state of the window.
             * If the window is already maximized, it unmaximizes the window.
             * If the window is not maximized, it maximizes the window.
             * @returns An undefined value.
             */
            handler: (): IpcChannelMap[typeof WINDOW_CHANNELS.MAXIMIZE]['return'] => {
                if (this.mainWindow.isMaximized()) {
                    this.mainWindow.unmaximize();
                } else {
                    this.mainWindow.maximize();
                }
            }
        };
    }

    /**
     * Close handler.
     * This IPC handler closes the window when invoked.
     * @returns An IPC handler object.
     */
    public closeHandler(): IpcHandler {
        return {
            channel: WINDOW_CHANNELS.CLOSE,
            operation: 'on',
            handler: (): IpcChannelMap[typeof WINDOW_CHANNELS.CLOSE]['return'] => {
                this.mainWindow.close();
            }
        };
    }

    /**
     * Gets the state of the window.
     * This IPC handler returns an object with the following properties:
     * - `isMaximized`: A boolean indicating whether the window is maximized.
     * - `isFocused`: A boolean indicating whether the window is focused.
     * @returns An IPC handler object.
     */
    public getStateHandler(): IpcHandler {
        return {
            channel: WINDOW_CHANNELS.GET_STATE,
            operation: 'handle',
            /**
             * IPC handler function that gets the state of the window.
             * @returns An object with the following properties:
             * - `isMaximized`: A boolean indicating whether the window is maximized.
             * - `isFocused`: A boolean indicating whether the window is focused.
             */
            handler: (): IpcChannelMap[typeof WINDOW_CHANNELS.GET_STATE]['return'] => ({
                isMaximized: this.mainWindow.isMaximized(),
                isFocused: this.mainWindow.isFocused(),
            })
        };
    }
}