// noinspection JSUnusedGlobalSymbols

import {ipcMain} from "electron";
import 'reflect-metadata';
import {IpcConfig, IpcHandler, IpcHandlerMetadata, IpcInvokeHandler} from "../types/ipc.type.ts";
import {IPC_HANDLERS_METADATA_KEY, IPC_MAIN_OPERATION} from "../constants/ipc.enum.ts";
import {LOG_MODULE_NAME} from "../constants/log.enum.ts";
import {Logger} from "../logger/Logger.ts";

const logger = new Logger(LOG_MODULE_NAME.IPC);

/**
 * A global set that stores all the classes registered as IPC (Inter-Process Communication) processors.
 * Each entry in this set represents a class constructor that is capable of handling IPC events.
 *
 * @type {Set<new (...args: any[]) => object>}
 * @description This set is used to keep track of all the classes that have been registered for handling IPC
 * communication, ensuring that all relevant IPC handlers are easily accessible.
 */
const registeredIpcClasses: Set<new (...args: any[]) => object> = new Set();

/**
 * A decorator function for registering an IPC handler method.
 * This decorator adds metadata to the target method to associate it with an IPC channel and operation type.
 *
 * @param config - The configuration object containing the IPC channel and operation type.
 *
 * @returns A method decorator function that attaches IPC handler metadata to the class method.
 *
 * @throws Error if the decorator is applied to a non-method (e.g., property or field).
 */
export function Ipc(config: IpcConfig): MethodDecorator {
    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void {
        // Ensure that the decorator is applied only to methods
        if (!descriptor || typeof descriptor.value !== 'function') {
            throw new Error('@Ipc can only be applied to method decorations');
        }

        // Retrieve existing IPC handlers metadata for the target class
        const existingHandlers: IpcHandlerMetadata[] =
            Reflect.getMetadata(IPC_HANDLERS_METADATA_KEY, target.constructor) || [];

        // Define the new handler metadata to add
        const handlers: IpcHandlerMetadata[] = [
            ...existingHandlers,
            {
                channel: config.channel,
                operation: config.operation,
                methodName: propertyKey
            }
        ];

        // Define the updated IPC handler metadata on the target class
        Reflect.defineMetadata(IPC_HANDLERS_METADATA_KEY, handlers, target.constructor);
    };
}

/**
 * A decorator function for registering a method as an IPC listener for an event (using the 'on' operation type).
 * This decorator automatically sets the operation type to 'on', meaning the handler will listen for incoming
 * messages on the specified channel.
 *
 * @param channel - The IPC channel the handler will listen to.
 *
 * @returns A method decorator that registers the method to handle incoming messages on the specified channel
 *          using the 'on' operation.
 */
export function IpcOn(channel: string): MethodDecorator {
    return Ipc({ channel, operation: IPC_MAIN_OPERATION.ON });
}

/**
 * A decorator function for registering a method as an IPC listener for a one-time event (using the 'once' operation type).
 * This decorator automatically sets the operation type to 'once', meaning the handler will listen for an incoming message
 * on the specified channel only once and will automatically remove itself after handling the event.
 *
 * @param channel - The IPC channel the handler will listen to.
 *
 * @returns A method decorator that registers the method to handle an incoming message only once on the specified channel
 *          using the 'once' operation.
 */
export function IpcOnce(channel: string): MethodDecorator {
    return Ipc({ channel, operation: IPC_MAIN_OPERATION.ONCE });
}

/**
 * A decorator function for registering a method to handle an IPC request-response operation (using the 'handle' operation type).
 * This decorator automatically sets the operation type to 'handle', meaning the handler will respond to incoming IPC messages
 * with a result or response.
 *
 * @param channel - The IPC channel the handler will respond to.
 *
 * @returns A method decorator that registers the method to handle IPC requests on the specified channel
 *          using the 'handle' operation.
 */
export function IpcHandle(channel: string): MethodDecorator {
    return Ipc({ channel, operation: IPC_MAIN_OPERATION.HANDLE });
}

/**
 * A higher-order function that dynamically registers IPC (Inter-Process Communication) handlers for a class.
 * It extends the provided class and automatically binds methods decorated with IPC decorators
 * to their respective IPC operations (`on`, `once`, `handle`) when an instance of the class is created.
 *
 * This function ensures that methods in the class that are bound to IPC operations are correctly
 * registered with the corresponding channels at runtime.
 *
 * @param constructor - The class constructor to be extended, which contains methods to be registered as IPC handlers.
 * @returns The extended class with IPC handlers automatically registered for the specified IPC operations.
 *
 * @throws {Error} If a method bound to an IPC operation is not a function.
 * @throws {Error} If an unsupported IPC operation is encountered.
 * @throws {Error} If no IPC handler metadata is found for the class.
 */
export function RegisterIpcHandlers<T extends new (...args: any[]) => object>(constructor: T): T {
    // Add the class to the global storage for IPC handlers
    registeredIpcClasses.add(constructor);

    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);

            // Retrieve metadata for IPC handlers registered on the class
            const handlers: IpcHandlerMetadata[] =
                Reflect.getMetadata(IPC_HANDLERS_METADATA_KEY, constructor) || [];

            if (handlers.length === 0) {
                throw new Error('No IPC handler metadata found for this class');
            }

            // Iterate over each handler's metadata and register it for the corresponding IPC operation
            handlers.forEach(({ channel, operation, methodName }) => {
                // Retrieve the method associated with the metadata's methodName
                const method =
                    (this as unknown as Record<string | symbol, IpcHandler | IpcInvokeHandler>)[methodName];

                if (typeof method !== 'function') {
                    throw new Error(`Method '${String(methodName)}' is not a function`);
                }

                // Bind the method to the current class instance
                const boundMethod = method.bind(this);

                // Register the method with the appropriate IPC operation
                switch (operation) {
                    case IPC_MAIN_OPERATION.ON:
                        ipcMain.on(channel, boundMethod as IpcHandler);
                        break;

                    case IPC_MAIN_OPERATION.ONCE:
                        ipcMain.once(channel, boundMethod as IpcHandler);
                        break;

                    case IPC_MAIN_OPERATION.HANDLE:
                        ipcMain.handle(channel, boundMethod as IpcInvokeHandler);
                        break;

                    default:
                        throw new Error(`Unsupported IPC operation: ${operation}`);
                }

                logger.debug(`IPC channel '${channel}' has been successfully registered.`);
            });
        }
    };
}

/**
 * Unregisters all IPC (Inter-Process Communication) handlers and removes all associated listeners
 * or handlers for each registered IPC channel.
 *
 * This function iterates through all registered IPC classes, retrieves their IPC handler metadata,
 * and removes the appropriate IPC handlers based on the operation type (`on`, `once`, `handle`)
 * associated with each channel. It also clears the global list of registered classes.
 *
 * The function ensures that all IPC operations are properly cleaned up, and no listeners or handlers
 * remain attached to the channels.
 *
 * @returns {void}
 *
 * @throws {Error} If an issue occurs while removing IPC handlers (e.g., unknown operations).
 */
export function unregisterAllIpcHandlers(): void {
    // Iterate over all registered IPC handler classes
    registeredIpcClasses.forEach(constructor => {
        // Retrieve the IPC handler metadata for the class
        const handlers: IpcHandlerMetadata[] =
            Reflect.getMetadata(IPC_HANDLERS_METADATA_KEY, constructor) || [];

        // Remove listeners for each registered IPC channel
        handlers.forEach(({ channel, operation }) => {
            switch (operation) {
                case IPC_MAIN_OPERATION.ON:
                case IPC_MAIN_OPERATION.ONCE:
                    ipcMain.removeAllListeners(channel);
                    break;

                case IPC_MAIN_OPERATION.HANDLE:
                    ipcMain.removeHandler(channel);
                    break;

                default:
                    logger.warn(`Unknown IPC operation: ${operation} for channel: ${channel}`);
            }

            logger.debug(`IPC channel '${channel}' has been unregistered.`);
        });
    });

    // Clear the global set of registered IPC handler classes
    registeredIpcClasses.clear();
}

/**
 * Unregisters the IPC (Inter-Process Communication) handlers for a specific class and removes
 * all associated listeners or handlers for the class's registered IPC channels.
 *
 * This function checks if the class has any registered IPC handlers, retrieves the handler
 * metadata, and removes the corresponding IPC operation listeners (`on`, `once`, `handle`)
 * for each channel. It also deletes the class from the global list of registered IPC classes.
 *
 * @param constructor - The class constructor for which IPC handlers should be unregistered.
 * @returns {void}
 *
 * @throws {Error} If there is an issue while removing IPC handlers (e.g., unknown operations).
 *
 * @example
 * // Example usage: Unregister IPC handlers for a specific class
 * unregisterIpcHandlers(MyIpcClass);
 */
export function unregisterIpcHandlers(constructor: new (...args: any[]) => object): void {
    if (!registeredIpcClasses.has(constructor)) {
        return;
    }

    const handlers: IpcHandlerMetadata[] =
        Reflect.getMetadata(IPC_HANDLERS_METADATA_KEY, constructor) || [];

    handlers.forEach(({ channel, operation }) => {
        switch (operation) {
            case IPC_MAIN_OPERATION.ON:
            case IPC_MAIN_OPERATION.ONCE:
                ipcMain.removeAllListeners(channel);
                break;

            case IPC_MAIN_OPERATION.HANDLE:
                ipcMain.removeHandler(channel);
                break;
        }

        logger.info(`The '${channel}' channel has been unregistered.`);
    });

    // Remove the class from the global list of registered classes
    registeredIpcClasses.delete(constructor);
}