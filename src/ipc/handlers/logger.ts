// noinspection ES6PreferShortImport

import {IpcHandler} from "../../types/ipc.ts";
import {IpcChannelMap} from "../IpcChannelMap.ts";
import {LOGGER_CHANNELS} from "../channels/logger.ts";
import log from "electron-log";

/**
 * LoggerHandlers is a utility class that provides handlers for various logging operations
 * to be used with Inter-Process Communication (IPC). Each handler is associated with a specific
 * log level (info, warn, error, debug, verbose) and listens for corresponding IPC messages.
 * When a message is received, the handler logs it using the appropriate log level.
 *
 * The handlers use predefined logging channels from `LOGGER_CHANNELS` and output log messages
 * with a specific module prefix, followed by the log message.
 */
export class LoggerHandlers {
    /**
     * Returns an IPC handler for the `info` log level.
     * Logs messages with the `info` level.
     *
     * @returns {IpcHandler} - The handler for logging info messages.
     */
    public infoHandler(): IpcHandler {
        return {
            channel: LOGGER_CHANNELS.INFO,
            operation: 'on',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof LOGGER_CHANNELS.INFO]['return'] => {
                const [module, ...text] = args;
                log.info(`${module}`, ...text);
            }
        };
    }

    /**
     * Returns an IPC handler for the `warn` log level.
     * Logs messages with the `warn` level.
     *
     * @returns {IpcHandler} - The handler for logging warn messages.
     */
    public warnHandler(): IpcHandler {
        return {
            channel: LOGGER_CHANNELS.WARN,
            operation: 'on',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof LOGGER_CHANNELS.WARN]['return'] => {
                const [module, ...text] = args;
                log.warn(`${module}`, ...text);
            }
        };
    }

    /**
     * Returns an IPC handler for the `error` log level.
     * Logs messages with the `error` level.
     *
     * @returns {IpcHandler} - The handler for logging error messages.
     */
    public errorHandler(): IpcHandler {
        return {
            channel: LOGGER_CHANNELS.ERROR,
            operation: 'on',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof LOGGER_CHANNELS.ERROR]['return'] => {
                const [module, ...text] = args;
                log.error(`${module}`, ...text);
            }
        };
    }

    /**
     * Returns an IPC handler for the `debug` log level.
     * Logs messages with the `debug` level.
     *
     * @returns {IpcHandler} - The handler for logging debug messages.
     */
    public debugHandler(): IpcHandler {
        return {
            channel: LOGGER_CHANNELS.DEBUG,
            operation: 'on',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof LOGGER_CHANNELS.DEBUG]['return'] => {
                const [module, ...text] = args;
                log.debug(`${module}`, ...text);
            }
        };
    }

    /**
     * Returns an IPC handler for the `verbose` log level.
     * Logs messages with the `verbose` level.
     *
     * @returns {IpcHandler} - The handler for logging verbose messages.
     */
    public verboseHandler(): IpcHandler {
        return {
            channel: LOGGER_CHANNELS.VERBOSE,
            operation: 'on',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof LOGGER_CHANNELS.VERBOSE]['return'] => {
                const [module, ...text] = args;
                log.verbose(`${module}`, ...text);
            }
        };
    }
}

