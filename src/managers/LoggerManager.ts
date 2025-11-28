import path from "node:path";
import {getResourceManager} from "./ResourceManager.ts";
import {RESOURCE_NAME} from "../constants/resources.enum.ts";
import fs from "fs";
import log from "electron-log";
import {app} from "electron";

/**
 * LoggerManager is responsible for managing the logging system in the application.
 * It handles the initialization, configuration, and setup of the logging mechanism,
 * including log file location and log levels based on whether the app is packaged or not.
 * The logs are stored in a log file, and the log format follows a specific timestamped pattern.
 */
export class LoggerManager {
    private readonly resourceManager = getResourceManager();
    private readonly logPath: string;

    constructor() {
        this.logPath = path.join(this.resourceManager.getResourcePath(RESOURCE_NAME.LOGS), 'latest.log');
    }

    /**
     * Initializes the logging system by clearing the previous log content and configuring the log system.
     * This method is usually called at the start of the application.
     */
    public initialization() {
        // Clear the previous log content.
        fs.writeFileSync(this.logPath, '');

        // Set up log configuration.
        this.configuration();
    }

    /**
     * Configures the logging system settings, including log levels and file format.
     * The configuration adjusts the log level based on whether the app is packaged or not.
     */
    private configuration() {
        log.transports.file.resolvePathFn = () => this.logPath;
        log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

        if (app.isPackaged) {
            log.transports.file.level = 'info';
            log.transports.console.level = false;
        } else {
            log.transports.file.level = 'debug';
            log.transports.console.level = 'debug';
        }
    }
}

let loggerManager: LoggerManager | null = null;

/**
 * Initializes the LoggerManager if not already initialized.
 * Returns the instance of LoggerManager.
 *
 * @returns {LoggerManager} The LoggerManager instance.
 */
export function initLoggerManager(): LoggerManager {
    if (!loggerManager) {
        loggerManager = new LoggerManager();
    }

    return loggerManager;
}

/**
 * Returns the instance of LoggerManager.
 * Throws an error if the LoggerManager is not initialized.
 *
 * @returns {LoggerManager} The LoggerManager instance.
 * @throws {Error} If LoggerManager is not initialized.
 */
export function getLoggerManager(): LoggerManager {
    if (!loggerManager) {
        throw new Error('LoggerManager not init. Call initLoggerManager first.');
    }

    return loggerManager;
}

export default LoggerManager;