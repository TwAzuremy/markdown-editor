/**
 * Symbol used to define the metadata key for IPC (Inter-Process Communication) handlers.
 * This symbol is used for associating metadata to IPC handler functions in a decorator-based approach.
 */
export const IPC_HANDLERS_METADATA_KEY = Symbol("ipc_handlers");

/**
 * Enum that defines different IPC operations that can be used in communication between the main and renderer processes.
 */
export enum IPC_MAIN_OPERATION {
    HANDLE = 'handle',
    ON = 'on',
    ONCE = 'once'
}

/**
 * A constant object that holds the IPC channel names grouped by categories.
 * These channels are used for sending and receiving messages between processes.
 */
export const IPC_CHANNELS =  {
    WINDOW: {
        MINIMIZE: 'window:minimize',
        MAXIMIZE: 'window:maximize',
        CLOSE: 'window:close',
        GET_STATE: 'window:get-state',
        ON_MAXIMIZE: 'window:on_maximize'
    },
    RESOURCE: {
        GET_RESOURCE_PATH: 'resource:get-resource-path',
        GET_LANGUAGE_MAP: 'resource:get-language-map',
        READ_JSON: 'resource:read-json'
    },
    LOGGER: {
        INFO: 'logger:info',
        WARN: 'logger:warn',
        ERROR: 'logger:error',
        DEBUG: 'logger:debug',
        VERBOSE: 'logger:verbose'
    },
    CONFIG: {
        GET: 'config:get',
        SET: 'config:set',
        DELETE: 'config:delete',
        RESET: 'config:reset'
    }
} as const;