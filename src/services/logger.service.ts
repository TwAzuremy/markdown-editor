import {IpcOn, RegisterIpcHandlers} from "../decorators/ipc.decorator.ts";
import type {IpcMainEvent} from 'electron';
import {LOG_MODULE_NAME} from "../constants/log.enum.ts";
import log from "electron-log";
import {IPC_CHANNELS} from "../constants/ipc.enum.ts";

/**
 * A class that handles logging operations for an Electron application.
 * The class provides methods for logging messages at different levels (info, warn, error, debug, verbose).
 * These methods are triggered by specific IPC channels and log messages using the `log` library.
 *
 * This class is decorated with `@RegisterIpcHandlers`, ensuring that all defined IPC handlers
 * are automatically registered when the class is instantiated.
 */
@RegisterIpcHandlers
export class LoggerHandlers {
    /**
     * Handler for the "info" logging operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.LOGGER.INFO`
     * and logs an informational message with the provided module name and arguments.
     *
     * @param _
     * @param module - The name of the module generating the log.
     * @param args - Additional arguments to be logged.
     */
    @IpcOn(IPC_CHANNELS.LOGGER.INFO)
    public infoHandler(_: IpcMainEvent, module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        log.info(`${module}`, ...args);
    }

    /**
     * Handler for the "warn" logging operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.LOGGER.WARN`
     * and logs a warning message with the provided module name and arguments.
     *
     * @param _
     * @param module - The name of the module generating the log.
     * @param args - Additional arguments to be logged.
     */
    @IpcOn(IPC_CHANNELS.LOGGER.WARN)
    public warnHandler(_: IpcMainEvent, module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        log.warn(`${module}`, ...args);
    }

    /**
     * Handler for the "error" logging operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.LOGGER.ERROR`
     * and logs an error message with the provided module name and arguments.
     *
     * @param _
     * @param module - The name of the module generating the log.
     * @param args - Additional arguments to be logged.
     */
    @IpcOn(IPC_CHANNELS.LOGGER.ERROR)
    public errorHandler(_: IpcMainEvent, module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        log.error(`${module}`, ...args);
    }

    /**
     * Handler for the "debug" logging operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.LOGGER.DEBUG`
     * and logs a debug message with the provided module name and arguments.
     *
     * @param _
     * @param module - The name of the module generating the log.
     * @param args - Additional arguments to be logged.
     */
    @IpcOn(IPC_CHANNELS.LOGGER.DEBUG)
    public debugHandler(_: IpcMainEvent, module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        log.debug(`${module}`, ...args);
    }

    /**
     * Handler for the "verbose" logging operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.LOGGER.VERBOSE`
     * and logs a verbose message with the provided module name and arguments.
     *
     * @param _
     * @param module - The name of the module generating the log.
     * @param args - Additional arguments to be logged.
     */
    @IpcOn(IPC_CHANNELS.LOGGER.VERBOSE)
    public verboseHandler(_: IpcMainEvent, module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        log.verbose(`${module}`, ...args);
    }
}