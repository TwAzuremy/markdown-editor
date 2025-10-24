import {WINDOW_CHANNELS} from "./channels/window.ts";
import {IpcCommand, IpcFetch, IpcQuery, IpcExecute} from "../types/ipc.ts";
import {RESOURCE_CHANNELS} from "@/ipc/channels/resource.ts";
import {LanguageMap} from "@/types/language.ts";
import {LOGGER_CHANNELS} from "@/ipc/channels/logger.ts";
import {LOG_MODULE_NAME} from "@/constants/log.enum.ts";
import {STORE_CHANNELS} from "@/ipc/channels/store.ts";

// Type mapping based on channel constants
export interface IpcChannelMap {
    [WINDOW_CHANNELS.MINIMIZE]: IpcCommand;
    [WINDOW_CHANNELS.MAXIMIZE]: IpcCommand;
    [WINDOW_CHANNELS.CLOSE]: IpcCommand;
    [WINDOW_CHANNELS.GET_STATE]: IpcQuery<{ isMaximized: boolean; isFocused: boolean }>;

    [RESOURCE_CHANNELS.GET_RESOURCE_PATH]: IpcFetch<[name: string | null | undefined], string>;
    [RESOURCE_CHANNELS.GET_LANGUAGE_MAP]: IpcQuery<Promise<LanguageMap>>;
    [RESOURCE_CHANNELS.READ_JSON]: IpcFetch<[resourceName: string, filename: string], object | null>;

    [LOGGER_CHANNELS.INFO]: IpcExecute<[module: LOG_MODULE_NAME | string, ...args: unknown[]]>;
    [LOGGER_CHANNELS.WARN]: IpcExecute<[module: LOG_MODULE_NAME | string, ...args: unknown[]]>;
    [LOGGER_CHANNELS.ERROR]: IpcExecute<[module: LOG_MODULE_NAME | string, ...args: unknown[]]>;
    [LOGGER_CHANNELS.DEBUG]: IpcExecute<[module: LOG_MODULE_NAME | string, ...args: unknown[]]>;
    [LOGGER_CHANNELS.VERBOSE]: IpcExecute<[module: LOG_MODULE_NAME | string, ...args: unknown[]]>;

    [STORE_CHANNELS.GET]: IpcFetch<[key: string, defaultValue: unknown], unknown>;
    [STORE_CHANNELS.SET]: IpcExecute<[key: string, value: unknown]>;
    [STORE_CHANNELS.DELETE]: IpcExecute<[key: string]>;
    [STORE_CHANNELS.RESET]: IpcCommand;
}