import {IpcHelper} from "@utils/IpcHelper.ts";
import {IPC_CHANNELS} from "@/constants/ipc.enum.ts";

/**
 * LoggerProxy class is a singleton pattern wrapper for logging messages with different log levels.
 * It provides static and instance methods for logging messages, allowing both direct and module-specific logging.
 * This class ensures that only a single instance of the logger exists across the application.
 * It is designed to be used with the `IpcHelper` object for logging to a specific logging system.
 *
 * @example
 * // Static methods (global access):
 * LoggerProxy.info('ModuleName', 'This is an info message');
 * LoggerProxy.error('ModuleName', 'This is an error message');
 *
 * // Instance methods (module-specific logging):
 * const logger = LoggerProxy.getInstance('ModuleName');
 *
 * logger.info('This is an info message');
 * logger.error('This is an error message');
 */
export class LoggerProxy {
    /**
     * The single instance of the LoggerProxy class (singleton pattern).
     */
    private static instance: LoggerProxy;

    /**
     * Creates an instance of LoggerProxy for a specific module.
     * @param moduleName The name of the module for which the logs are generated.
     */
    constructor(private readonly moduleName: string = '') {
        this.moduleName = moduleName;
    }

    /**
     * Retrieves the single instance of the LoggerProxy class (singleton).
     * If no instance exists, it will create a new one with the provided module name.
     *
     * @param moduleName The module name for which to create the logger instance. Default is an empty string.
     * @returns The LoggerProxy instance.
     */
    public static getInstance(moduleName: string = ''): LoggerProxy {
        if (!LoggerProxy.instance) {
            LoggerProxy.instance = new LoggerProxy(moduleName);
        }

        return LoggerProxy.instance;
    }

    /**
     * Logs an informational message at the 'info' level using the global logger.
     *
     * @param moduleName The name of the module. Default is an empty string.
     * @param args The message or data to log.
     */
    public static info(moduleName: string = '', ...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.INFO, moduleName, ...args);
    }

    /**
     * Logs a warning message at the 'warn' level using the global logger.
     *
     * @param moduleName The name of the module. Default is an empty string.
     * @param args The message or data to log.
     */
    public static warn(moduleName: string = '', ...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.WARN, moduleName, ...args);
    }

    /**
     * Logs an error message at the 'error' level using the global logger.
     *
     * @param moduleName The name of the module. Default is an empty string.
     * @param args The message or data to log.
     */
    public static error(moduleName: string = '', ...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.ERROR, moduleName, ...args);
    }

    /**
     * Logs a debugging message at the 'debug' level using the global logger.
     *
     * @param moduleName The name of the module. Default is an empty string.
     * @param args The message or data to log.
     */
    public static debug(moduleName: string = '', ...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.DEBUG, moduleName, ...args);
    }

    /**
     * Logs a verbose message at the 'verbose' level using the global logger.
     *
     * @param moduleName The name of the module. Default is an empty string.
     * @param args The message or data to log.
     */
    public static verbose(moduleName: string = '', ...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.VERBOSE, moduleName, ...args);
    }

    /**
     * Logs an informational message at the 'info' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public info(...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.INFO, this.moduleName, ...args);
    }

    /**
     * Logs a warning message at the 'warn' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public warn(...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.WARN, this.moduleName, ...args);
    }

    /**
     * Logs an error message at the 'error' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public error(...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.ERROR, this.moduleName, ...args);
    }

    /**
     * Logs a debugging message at the 'debug' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public debug(...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.DEBUG, this.moduleName, ...args);
    }

    /**
     * Logs a verbose message at the 'verbose' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public verbose(...args: unknown[]): void {
        IpcHelper.emit(IPC_CHANNELS.LOGGER.VERBOSE, this.moduleName, ...args);
    }

    /**
     * Creates a new instance of the LoggerProxy class with a different module name.
     *
     * @param moduleName The new module name to use for logging.
     * @returns A new LoggerProxy instance with the specified module name.
     */
    public withModule(moduleName: string): LoggerProxy {
        return new LoggerProxy(moduleName);
    }
}