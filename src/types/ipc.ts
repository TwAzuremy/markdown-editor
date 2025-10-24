import {IpcMainInvokeEvent, IpcMainEvent, WebContents} from 'electron';
import {IpcChannelMap} from "@/ipc/IpcChannelMap.ts";

/**
 * IPC operation type
 *
 * This type defines the valid IPC operations.
 * The valid operations are:
 *
 * - handle: Handle an IPC event.
 * - on: Listens for an IPC event.
 * - once: Listens for an IPC event once.
 */
export type IpcMainOperation = 'handle' | 'on' | 'once';

/**
 * Defines the general IPC types.
 *
 * IPC channels are objects that define the IPC operations.
 * The channel object must have an `operation` property that specifies the IPC operation type.
 * The channel object must also have an `args` property that specifies the arguments of the IPC operation.
 * The channel object must also have a `return` property that specifies the return type of the IPC operation.
 */
export type IpcChannel<Args extends unknown[] = [], Return = void> = {
    operation: IpcMainOperation;
    args: Args;
    return: Return;
};

/**
 * IPC command type
 *
 * An IPC command is an IPC channel that has no parameters and no return value.
 */
export type IpcCommand = IpcChannel;

/**
 * IPC query type
 *
 * An IPC query is an IPC channel that has a return value but no parameters.
 */
export type IpcQuery<T> = IpcChannel<[], T>;

/**
 * IPC execute type
 *
 * An IPC execute is an IPC channel that has parameters but no return value.
 */
export type IpcExecute<Args extends unknown[] = []> = IpcChannel<Args>;


/**
 * IPC fetch type
 *
 * An IPC fetch is an IPC channel that has parameters and return value.
 */
export type IpcFetch<Args extends unknown[] = [], T = void> = IpcChannel<Args, T>;

/**
 * IPC processor interface
 *
 * This interface defines the shape of an IPC processor.
 * An IPC processor is an object that is used to process IPC events.
 * The processor object must have a `channel` property that specifies the IPC channel to process.
 * The processor object must also have an `operation` property that specifies the IPC operation type.
 * The processor object must also have a `handler` property that is a function that takes an IPC event and any additional arguments specified in the IPC channel map.
 */
export interface IpcHandler<T extends keyof IpcChannelMap = keyof IpcChannelMap> {
    channel: T;
    operation: IpcChannelMap[T]['operation'];
    handler: (
        event: IpcMainInvokeEvent | IpcMainEvent,
        ...args: IpcChannelMap[T]['args']
    ) => IpcChannelMap[T]['return'] | Promise<IpcChannelMap[T]['return']>;
}

/**
 * IPC sender interface (main process sends to renderer process)
 *
 * This interface defines the shape of an IPC sender.
 * An IPC sender is an object that is used by the main process to send messages to the renderer process.
 * The sender object must have a `channel` property that specifies the IPC channel to send the message to.
 * The sender object must also have a `send` property that is a function that takes a web contents object and any additional arguments specified in the IPC channel map.
 * The `send` function sends the message to the specified IPC channel in the renderer process.
 */
export interface IpcSender<T extends keyof IpcChannelMap = keyof IpcChannelMap> {
    channel: T;
    operation: 'send';
    send: (webContents: WebContents, ...args: IpcChannelMap[T]['args']) => void;
}

/**
 * IPC sender map type.
 * This type defines the structure of an IPC sender map.
 * The keys of this type are the IPC channel names, and the values are objects with an operation and a send function.
 * The operation is always 'send', and the send function takes a web contents object and the channel specific arguments.
 */
export type IpcSenderMap = {
    [K in keyof IpcChannelMap]: {
        operation: 'send';
        send: (webContents: WebContents, ...args: IpcChannelMap[K]['args']) => void;
    }
}