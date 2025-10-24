/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
    interface ProcessEnv {
        /**
         * The built directory structure
         *
         * ```tree
         * ├─┬─┬ dist
         * │ │ └── index.html
         * │ │
         * │ ├─┬ dist-electron
         * │ │ ├── main.js
         * │ │ └── preload.js
         * │
         * ```
         */
        APP_ROOT: string;
        /** /dist/ or /public/ */
        VITE_PUBLIC: string;
    }
}

// Define a type for safe IPC (Inter-Process Communication) handlers
// This allows any IPC handler that returns a type of T (or void if not specified)
type SafeIPCHandler<T = void> = (channel: string, ...args: unknown[]) => T;
// Define the type of a logger handler that logs messages based on the module and arguments
// It's used for logging at different levels (info, warn, error, debug, verbose)
type LoggerHandler = (module: string | null | undefined, ...args: unknown[]) => void;

// Custom interface to represent the IPC Renderer in Electron with different types of IPC communication
// `command`, `query`, `execute`, `fetch` are all different ways to communicate with the main process
interface CustomIpcRenderer {
    command: SafeIPCHandler;
    query: SafeIPCHandler<Promise<unknown>>;
    execute: SafeIPCHandler;
    fetch: SafeIPCHandler<Promise<unknown>>;
}

// LoggerIpcRenderer defines IPC renderer communication methods for logging at different levels
// It includes functions to log messages of varying severity
interface LoggerIpcRenderer {
    info: LoggerHandler,
    warn: LoggerHandler,
    error: LoggerHandler,
    debug: LoggerHandler,
    verbose: LoggerHandler
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
    ipcRenderer: import('electron').IpcRenderer & CustomIpcRenderer;
    logger: LoggerIpcRenderer;
}
