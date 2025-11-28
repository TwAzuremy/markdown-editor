import log from "electron-log";

/**
 * Logger class provides a set of methods for logging messages with different log levels.
 * It allows logging with a specific module name and supports common log levels: info, warn, error, debug, and verbose.
 * The class provides both static and instance methods for logging, where static methods log without an instance,
 * while instance methods log with a specific module name assigned to the instance.

 * @example
 * // Static methods:
 * Logger.info('MyModule', 'This is an info message');
 * Logger.error('MyModule', 'This is an error message');
 *
 * // Instance methods:
 * const logger = new Logger('MyModule');
 * logger.info('This is an info message');
 * logger.error('This is an error message');
 */
export class Logger {
    /**
     * @param moduleName The name of the module for which the logs are being generated. Default is 'UNKNOWN'.
     */
    constructor(private readonly moduleName: string = 'UNKNOWN') {
        this.moduleName = moduleName;
    }

    /**
     * Logs an informational message at the 'info' level.
     *
     * @param moduleName The name of the module. Default is 'UNKNOWN'.
     * @param args The message or data to log.
     */
    public static info(moduleName: string = 'UNKNOWN', ...args: unknown[]): void {
        log.info(`[${moduleName}]`, ...args);
    }

    /**
     * Logs a warning message at the 'warn' level.
     *
     * @param moduleName The name of the module. Default is 'UNKNOWN'.
     * @param args The message or data to log.
     */
    public static warn(moduleName: string = 'UNKNOWN', ...args: unknown[]): void {
        log.warn(`[${moduleName}]`, ...args);
    }

    /**
     * Logs an error message at the 'error' level.
     *
     * @param moduleName The name of the module. Default is 'UNKNOWN'.
     * @param args The message or data to log.
     */
    public static error(moduleName: string = 'UNKNOWN', ...args: unknown[]): void {
        log.error(`[${moduleName}]`, ...args);
    }

    /**
     * Logs a debugging message at the 'debug' level.
     *
     * @param moduleName The name of the module. Default is 'UNKNOWN'.
     * @param args The message or data to log.
     */
    public static debug(moduleName: string = 'UNKNOWN', ...args: unknown[]): void {
        log.debug(`[${moduleName}]`, ...args);
    }

    /**
     * Logs a verbose message at the 'verbose' level.
     *
     * @param moduleName The name of the module. Default is 'UNKNOWN'.
     * @param args The message or data to log.
     */
    public static verbose(moduleName: string = 'UNKNOWN', ...args: unknown[]): void {
        log.verbose(`[${moduleName}]`, ...args);
    }

    /**
     * Logs an informational message at the 'info' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public info(...args: unknown[]): void {
        log.info(`[${this.moduleName}]`, ...args);
    }

    /**
     * Logs a warning message at the 'warn' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public warn(...args: unknown[]): void {
        log.warn(`[${this.moduleName}]`, ...args);
    }

    /**
     * Logs an error message at the 'error' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public error(...args: unknown[]): void {
        log.error(`[${this.moduleName}]`, ...args);
    }

    /**
     * Logs a debugging message at the 'debug' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public debug(...args: unknown[]): void {
        log.debug(`[${this.moduleName}]`, ...args);
    }

    /**
     * Logs a verbose message at the 'verbose' level for the current instance's module.
     *
     * @param args The message or data to log.
     */
    public verbose(...args: unknown[]): void {
        log.verbose(`[${this.moduleName}]`, ...args);
    }

    /**
     * Creates a new instance of the Logger class with a different module name.
     *
     * @param moduleName The new module name to use for logging.
     * @returns A new Logger instance with the specified module name.
     */
    public withModule(moduleName: string): Logger {
        return new Logger(moduleName);
    }
}