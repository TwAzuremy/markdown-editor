import {app, BrowserWindow} from 'electron';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import * as process from "node:process";
import path from 'node:path';

import {ResourceManager, initResourceManager} from "../manager/ResourceManager.ts";
import {initLoggerManager, LoggerManager} from "../manager/LoggerManager.ts";
import {RESOURCE_NAME} from "../constants/resources.enum.ts";
import {LOG_MODULE_NAME} from "../constants/log.enum.ts";
import {LogUtil} from "../utils/LogUtil.ts";
import {getStoreManager, StoreManager} from "../store/StoreManager.ts";
import {STORE_KEY} from "../constants/config.enum.ts";

// Ipc Manager
import {IpcManager} from "../ipc/IpcManager.ts";
import {WINDOW_CHANNELS} from "../ipc/channels/window.ts";
import {WindowHandlers} from "../ipc/handlers/window.ts";
import {WindowRegistry} from "../ipc/registries/window.ts";
import {ResourceHandlers} from "../ipc/handlers/resource.ts";
import {ResourceRegistry} from "../ipc/registries/resource.ts";
import {LoggerHandlers} from "../ipc/handlers/logger.ts";
import {LoggerRegistry} from "../ipc/registries/logger.ts";
import {StoreHandlers} from "../ipc/handlers/store.ts";
import {StoreRegistry} from "../ipc/registries/store.ts";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow;

// Initialize Resource Manager
const resourceManager: ResourceManager = initResourceManager({
    locales: RESOURCE_NAME.LOCALES,
    logs: RESOURCE_NAME.LOGS,
    config: RESOURCE_NAME.CONFIG,
});

const storeManager: StoreManager = getStoreManager();

// Initialize Logger Manager
const loggerManager: LoggerManager = initLoggerManager();
const logger = new LogUtil(LOG_MODULE_NAME.MAIN);

const ipcManager: IpcManager = new IpcManager();

function createWindow() {
    // Initialize configuration logging
    loggerManager.initialization();
    logger.info('App is starting...');

    const windowBounds = storeManager.getWindowBounds();
    const windowIsMaximized = storeManager.get(STORE_KEY.WINDOW_MAXIMIZE, false);

    win = new BrowserWindow({
        width: windowBounds?.width,
        height: windowBounds?.height,
        x: windowBounds?.x,
        y: windowBounds?.y,
        frame: false,
        show: false,
        icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false,
            nodeIntegration: false,
            contextIsolation: true
        },
    });

    win.once('ready-to-show', () => {
        if (windowIsMaximized) win.maximize();

        win.show();
    });

    // Initialize and register all IPC handlers
    initializeIpc();
    // Start window listener
    windowListeners(win);

    if (VITE_DEV_SERVER_URL) {
        // noinspection JSIgnoredPromiseFromCall
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        // win.loadFile('dist/index.html')
        // noinspection JSIgnoredPromiseFromCall
        win.loadFile(path.join(RENDERER_DIST, 'index.html'));
    }

    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
}

function windowListeners(win: BrowserWindow) {
    // Listen for changes in the window's maximized state.
    win.on('maximize', () => win.webContents.send(WINDOW_CHANNELS.ON_MAXIMIZE, true));
    win.on('unmaximize', () => win.webContents.send(WINDOW_CHANNELS.ON_MAXIMIZE, false));

    // Save the window boundaries and state when the window is closed.
    win.on('close', () => {
        const isMaximized = win.isMaximized();

        // Save window boundaries only when not maximized.
        if (!isMaximized) {
            saveWindowBounds();
        }

        storeManager.set(STORE_KEY.WINDOW_MAXIMIZE, isMaximized);
    });
}

/**
 * Initialize IPC (Inter-Process Communication) for the current window.
 *
 * This function creates a handler instance for the current window,
 * creates a registrar for the handler instance, adds the registrar
 * to the IPC manager, and registers all IPCs.
 */
function initializeIpc() {
    // Create a handler instance
    const windowHandlers = new WindowHandlers(win);
    const resourceHandlers = new ResourceHandlers();
    const loggerHandlers = new LoggerHandlers();
    const storeHandlers = new StoreHandlers();
    // Create a registrar
    const windowRegistry = new WindowRegistry(windowHandlers);
    const resourceRegistry = new ResourceRegistry(resourceHandlers);
    const loggerRegistry = new LoggerRegistry(loggerHandlers);
    const storeRegistry = new StoreRegistry(storeHandlers);

    // Add to manager
    ipcManager.addRegistry(windowRegistry);
    ipcManager.addRegistry(resourceRegistry);
    ipcManager.addRegistry(loggerRegistry);
    ipcManager.addRegistry(storeRegistry);

    // Register all IPC
    ipcManager.registerAll();
}

/**
 * Save the window bounds to the store.
 *
 * This function checks if the main window exists and retrieves its bounds.
 * If the main window exists, the bounds are stored in the store under the key "md-editor.windowBounds".
 */
function saveWindowBounds(): void {
    if (win) {
        // Get the bounds of the main window
        const bounds = win.getBounds();

        storeManager.setWindowBounds(bounds);
        logger.info(`Save window bounds: `, bounds);
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // TODO [Reserved] Add log archiving operation, use gzip compression,
        //  and set the compressed file suffix to *.log.gz.

        logger.info('Quitting application...');
        // Clean up IPC before the application exits.
        ipcManager.unregisterAll();

        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(createWindow);
