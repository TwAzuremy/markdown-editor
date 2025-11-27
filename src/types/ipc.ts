import {IpcMainEvent, IpcMainInvokeEvent} from "electron";
import {IPC_MAIN_OPERATION} from "../constants/ipc.enum.ts";

/**
 * Type definition for an IPC handler function.
 * This handler is invoked in response to an IPC message from the renderer process.
 *
 * @param event - The IPC event sent from the renderer process.
 * @param args - A rest parameter for any additional arguments passed with the event.
 */
export type IpcHandler = (event: IpcMainEvent, ...args: unknown[]) => void;

/**
 * Type definition for an IPC invoke handler function.
 * This handler is used when invoking an IPC message from the renderer process that expects a response.
 *
 * @param event - The IPC event sent from the renderer process.
 * @param args - A rest parameter for any additional arguments passed with the event.
 * @returns A value that will be sent back to the renderer process.
 */
export type IpcInvokeHandler = (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown;

/**
 * Interface representing the configuration for an IPC handler.
 * This configuration object contains the channel and operation to be used for the handler.
 */
export interface IpcConfig {
    /**
     * The IPC channel through which messages will be sent/received.
     */
    channel: string;

    /**
     * The operation type to perform on the IPC message.
     * It can be one of 'handle', 'on', or 'once'.
     */
    operation: IPC_MAIN_OPERATION;
}

/**
 * Interface for the metadata associated with an IPC handler.
 * This metadata helps in identifying the channel, operation, and method name for an IPC handler.
 */
export interface IpcHandlerMetadata {
    /**
     * The IPC channel that the handler listens to or handles messages from.
     */
    channel: string;

    /**
     * The operation type associated with the handler (e.g., 'handle', 'on', 'once').
     */
    operation: IPC_MAIN_OPERATION;

    /**
     * The name or symbol of the method that is handling the IPC message.
     */
    methodName: string | symbol;
}