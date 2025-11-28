import {app, BrowserWindow} from 'electron';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import * as process from "node:process";
import path from 'node:path';
import fs from "fs";
import log from "electron-log";

import {ResourceManager} from "../managers/ResourceManager.ts";
import {RESOURCE_NAME} from "../constants/resources.enum.ts";
import {Logger} from "../logger/Logger.ts";
import {LOG_MODULE_NAME} from "../constants/log.enum.ts";
import {getStoreManager, StoreManager} from "../managers/StoreManager.ts";
import {STORE_KEY} from "../constants/config.enum.ts";
import {unregisterAllIpcHandlers} from "../decorators/ipc.decorator.ts";

// Ipc Channels
import {IPC_CHANNELS} from "../constants/ipc.enum.ts";

// IPC Services
import {WindowHandlers} from "../services/window.service.ts";
import {ResourceHandlers} from "../services/resource.service.ts";
import {LoggerHandlers} from "../services/logger.service.ts";
import {StoreHandlers} from "../services/store.service.ts";

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
const resourceManager: ResourceManager = ResourceManager.initialize(app, {
    locales: RESOURCE_NAME.LOCALES,
    logs: RESOURCE_NAME.LOGS,
    config: RESOURCE_NAME.CONFIG,
});

// Initialize Log Configuration
initializeLoggerConfiguration(
    path.join(resourceManager.getResourcePath(RESOURCE_NAME.LOGS), 'latest.log')
);

const storeManager: StoreManager = getStoreManager();

// Initialize Logger Manager
const logger = new Logger(LOG_MODULE_NAME.MAIN);

function createWindow() {
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
    win.on('maximize', () => win.webContents.send(IPC_CHANNELS.WINDOW.ON_MAXIMIZE, true));
    win.on('unmaximize', () => win.webContents.send(IPC_CHANNELS.WINDOW.ON_MAXIMIZE, false));

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
 * to the IPC managers, and registers all IPCs.
 */
function initializeIpc() {
    new WindowHandlers(win);
    new ResourceHandlers(resourceManager);
    new LoggerHandlers();
    new StoreHandlers(storeManager);
}

function initializeLoggerConfiguration(logPath: string) {
    fs.writeFileSync(logPath, '');

    log.transports.file.resolvePathFn = () => logPath;
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

    if (app.isPackaged) {
        log.transports.file.level = 'info';
        log.transports.console.level = false;
    } else {
        log.transports.file.level = 'debug';
        log.transports.console.level = 'debug';
    }
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
        unregisterAllIpcHandlers();

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
