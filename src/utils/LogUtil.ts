import log from "electron-log";
import {LOG_MODULE_NAME} from "@/constants/log.enum.ts";

/**
 * LogUtil is a utility class that provides logging functionality for specific modules
 * within the application. It helps in logging messages with a custom module name for better
 * organization and traceability of logs. The available log levels are `info`, `warn`, `error`,
 * `debug`, and `verbose`.
 *
 * Log messages are prefixed with the module name, making it easier to identify the origin
 * of the logs within the application.
 */
export class LogUtil {
    private readonly MODULE_NAME: string;
    private static instance: LogUtil;

    /**
     * Constructor for LogUtil.
     * Initializes the module name that will be used in the log messages.
     *
     * @param {string} module - The name of the module for which logs will be created.
     */
    constructor(module: string) {
        this.MODULE_NAME = module;
    }

    // Singleton access method
    public static getInstance(module: LOG_MODULE_NAME | string): LogUtil {
        if (!LogUtil.instance) {
            LogUtil.instance = new LogUtil(module);
        }

        return LogUtil.instance;
    }

    /**
     * Internal method to output log messages based on the specified log level.
     *
     * @param {string} level - The log level, which could be 'info', 'warn', 'error', 'debug', or 'verbose'.
     * @param {LOG_MODULE_NAME | string} module - The module name.
     * @param {...unknown[]} args - The log message(s) to be printed.
     */
    protected output(level: string, module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        switch (level) {
            case 'info':
                log.info(`${module}`, ...args);
                break;
            case 'warn':
                log.warn(`${module}`, ...args);
                break;
            case 'error':
                log.error(`${module}`, ...args);
                break;
            case 'debug':
                log.debug(`${module}`, ...args);
                break;
            case 'verbose':
                log.verbose(`${module}`, ...args);
                break;
        }
    }

    /**
     * Logs an info message with the module name as a prefix.
     *
     * @param {...unknown[]} args - The message(s) to log.
     */
    public info(...args: unknown[]): void {
        this.output('info', `[${this.MODULE_NAME}]`, ...args);
    }

    /**
     * Logs a warning message with the module name as a prefix.
     *
     * @param {...unknown[]} args - The message(s) to log.
     */
    public warn(...args: unknown[]): void {
        this.output('warn', `[${this.MODULE_NAME}]`, ...args);
    }

    /**
     * Logs an error message with the module name as a prefix.
     *
     * @param {...unknown[]} args - The message(s) to log.
     */
    public error(...args: unknown[]): void {
        this.output('error', `[${this.MODULE_NAME}]`, ...args);
    }

    /**
     * Logs a debug message with the module name as a prefix.
     *
     * @param {...unknown[]} args - The message(s) to log.
     */
    public debug(...args: unknown[]): void {
        this.output('debug', `[${this.MODULE_NAME}]`, ...args);
    }

    /**
     * Logs a verbose message with the module name as a prefix.
     *
     * @param {...unknown[]} args - The message(s) to log.
     */
    public verbose(...args: unknown[]): void {
        this.output('verbose', `[${this.MODULE_NAME}]`, ...args);
    }

    /**
     * Logs an info message with the module name as a prefix.
     *
     * @param {LOG_MODULE_NAME | string} module - The name of the module for which logs are being created.
     * @param {...unknown[]} args - The message(s) to log.
     */
    public static info(module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        LogUtil.getInstance(module).output('info', `${module}`, ...args);
    }

    /**
     * Logs a warning message with the module name as a prefix.
     *
     * @param {LOG_MODULE_NAME | string} module - The name of the module for which logs are being created.
     * @param {...unknown[]} args - The message(s) to log.
     */
    public static warn(module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        LogUtil.getInstance(module).output('warn', `[${module}]`, ...args);
    }

    /**
     * Logs an error message with the module name as a prefix.
     *
     * @param {LOG_MODULE_NAME | string} module - The name of the module for which logs are being created.
     * @param {...unknown[]} args - The message(s) to log.
     */
    public static error(module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        LogUtil.getInstance(module).output('error', `[${module}]`, ...args);
    }

    /**
     * Logs a debug message with the module name as a prefix.
     *
     * @param {LOG_MODULE_NAME | string} module - The name of the module for which logs are being created.
     * @param {...unknown[]} args - The message(s) to log.
     */
    public static debug(module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        LogUtil.getInstance(module).output('debug', `[${module}]`, ...args);
    }

    /**
     * Logs a verbose message with the module name as a prefix.
     *
     * A verbose log message is typically used to log information that is useful for debugging
     * purposes but may not be critical enough to warrant an info log level.
     *
     * @param {LOG_MODULE_NAME | string} module - The name of the module for which logs are being created.
     * @param {...unknown[]} args - The message(s) to log.
     */
    public static verbose(module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        LogUtil.getInstance(module).output('verbose', `[${module}]`, ...args);
    }

    /**
     * Returns the module name associated with this logger instance.
     *
     * @returns {string} - The module name.
     */
    get module(): string {
        return this.MODULE_NAME;
    }
}