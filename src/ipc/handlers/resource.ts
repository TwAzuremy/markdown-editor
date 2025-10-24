// noinspection ES6PreferShortImport

import {IpcHandler} from "../../types/ipc.ts";
import {IpcChannelMap} from "../IpcChannelMap.ts";
import {RESOURCE_CHANNELS} from "../channels/resource.ts";
import {getResourceManager, ResourceManager} from "../../manager/ResourceManager.ts";
import {getLanguageMap} from "../../utils/LanguageUtils.ts";
import {RESOURCE_NAME} from "../../constants/resources.enum.ts";

export class ResourceHandlers {
    private readonly resourceManager: ResourceManager;

    /**
     * Constructor for ResourceHandlers.
     */
    constructor() {
        this.resourceManager = getResourceManager();
    }

    /**
     * Returns an IPC handler for the GET_RESOURCE_PATH operation.
     * The handler retrieves the resource path for a given resource name.
     *
     * @returns The IPC handler for GET_RESOURCE_PATH.
     */
    public getResourcePath(): IpcHandler {
        return {
            channel: RESOURCE_CHANNELS.GET_RESOURCE_PATH,
            operation: 'handle',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof RESOURCE_CHANNELS.GET_RESOURCE_PATH]['return'] => {
                const [name] = args;

                return this.resourceManager.getResourcePath(name);
            }
        };
    }

    /**
     * Returns an IPC handler for the GET_LANGUAGE_MAP operation.
     * The handler retrieves the language map based on the resource path for locales.
     *
     * @returns The IPC handler for GET_LANGUAGE_MAP.
     */
    public getLanguageMap(): IpcHandler {
        return {
            channel: RESOURCE_CHANNELS.GET_LANGUAGE_MAP,
            operation: 'handle',
            handler: async (): IpcChannelMap[typeof RESOURCE_CHANNELS.GET_LANGUAGE_MAP]['return'] => {
                return await getLanguageMap(this.resourceManager.getResourcePath(RESOURCE_NAME.LOCALES));
            }
        };
    }

    /**
     * Returns an IPC handler for the READ_JSON operation.
     * The handler reads a JSON file for a given resource name and filename.
     *
     * @returns The IPC handler for READ_JSON.
     */
    public readJson(): IpcHandler {
        return {
            channel: RESOURCE_CHANNELS.READ_JSON,
            operation: 'handle',
            handler: (
                _, ...args
            ): IpcChannelMap[typeof RESOURCE_CHANNELS.READ_JSON]['return'] => {
                const [resourceName, filename] = args;

                return this.resourceManager.readJsonFile(resourceName, filename as string);
            }
        };
    }
}