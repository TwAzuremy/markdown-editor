import {BrowserWindow} from "electron";
import {IpcOn, IpcHandle, RegisterIpcHandlers} from "../decorators/ipc.decorator.ts";
import {IPC_CHANNELS} from "../constants/ipc.enum.ts";

/**
 * A class that handles various window operations for an Electron `BrowserWindow`.
 * The class uses IPC decorators to register handlers for operations like
 * minimizing, maximizing, closing, and retrieving the window state.
 *
 * This class is decorated with `@RegisterIpcHandlers`, which automatically registers
 * the IPC handlers defined in the class during instantiation.
 */
@RegisterIpcHandlers
export class WindowHandlers {
    /**
     * Creates an instance of the WindowHandlers class.
     *
     * @param mainWindow - The Electron `BrowserWindow` instance that the handlers will manage.
     */
    constructor(private mainWindow: BrowserWindow) {
    }

    /**
     * Handler for the "minimize" operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.WINDOW.MINIMIZE`
     * and minimizes the window.
     */
    @IpcOn(IPC_CHANNELS.WINDOW.MINIMIZE)
    public minimizeHandler(): void {
        this.mainWindow.minimize();
    }

    /**
     * Handler for the "maximize" operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.WINDOW.MAXIMIZE`.
     * It toggles the window state between maximized and restored.
     *
     * If the window is already maximized, it will be restored to its previous state.
     * If the window is not maximized, it will be maximized.
     */
    @IpcOn(IPC_CHANNELS.WINDOW.MAXIMIZE)
    public maximizeHandler(): void {
        if (this.mainWindow.isMaximized()) {
            this.mainWindow.unmaximize();
        } else {
            this.mainWindow.maximize();
        }
    }

    /**
     * Handler for the "close" operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.WINDOW.CLOSE`
     * and closes the window.
     */
    @IpcOn(IPC_CHANNELS.WINDOW.CLOSE)
    public closeHandler(): void {
        this.mainWindow.close();
    }

    /**
     * Handler for the "get state" operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.WINDOW.GET_STATE`.
     * It returns an object containing the current state of the window, including:
     * - `isMaximized`: A boolean indicating whether the window is maximized.
     * - `isFocused`: A boolean indicating whether the window is focused.
     *
     * @returns An object containing the window's maximized and focused states.
     */
    @IpcHandle(IPC_CHANNELS.WINDOW.GET_STATE)
    public getStateHandler(): { isMaximized: boolean; isFocused: boolean } {
        return {
            isMaximized: this.mainWindow.isMaximized(),
            isFocused: this.mainWindow.isFocused()
        };
    }
}