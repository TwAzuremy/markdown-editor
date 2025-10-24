import {LogUtil} from "@utils/LogUtil.ts";
import {LOG_MODULE_NAME} from "@/constants/log.enum.ts";

/**
 * IpcLogUtil is a subclass of the `LogUtil` class that overrides the `output` method
 * to route log messages to a different logging system, specifically for IPC (Inter-Process Communication).
 * It uses `window.logger` for logging messages in various log levels, such as `info`, `warn`, `error`,
 * `debug`, and `verbose`.
 *
 * This class is intended to be used for logging in environments where IPC communication is involved.
 */
export class IpcLogUtil extends LogUtil {
    /**
     * Overrides the `output` method of `LogUtil` to redirect logs to the IPC logger system (window.logger).
     *
     * @param {string} level - The log level, which could be 'info', 'warn', 'error', 'debug', or 'verbose'.
     * @param {LOG_MODULE_NAME | string} module - The name of the module generating the log.
     * @param {...unknown[]} args - The log message(s) to be passed to the logger.
     */
    protected override output(level: string, module: LOG_MODULE_NAME | string, ...args: unknown[]): void {
        switch (level) {
            case 'info':
                window.logger.info(module, ...args);
                break;
            case 'warn':
                window.logger.warn(module, ...args);
                break;
            case 'error':
                window.logger.error(module, ...args);
                break;
            case 'debug':
                window.logger.debug(module, ...args);
                break;
            case 'verbose':
                window.logger.verbose(module, ...args);
                break;
        }
    }
}

let logInstance: IpcLogUtil | null = null;

/**
 * Initializes the renderer log instance if it hasn't been initialized already.
 * This method ensures that only one instance of IpcLogUtil is created for the renderer.
 *
 * @returns {IpcLogUtil} - The instance of IpcLogUtil.
 */
export function initRendererLog(): IpcLogUtil {
    if (!logInstance) {
        logInstance = new IpcLogUtil(LOG_MODULE_NAME.RENDERER);
    }

    return logInstance;
}

/**
 * Retrieves the renderer log instance. If it hasn't been initialized, it throws an error.
 *
 * @throws {Error} - If the renderer log is not initialized yet.
 * @returns {IpcLogUtil} - The instance of IpcLogUtil.
 */
export function getRendererLog(): IpcLogUtil {
    if (!logInstance) {
        throw new Error('RendererLog not init. Call initRendererLog first');
    }

    return logInstance;
}

