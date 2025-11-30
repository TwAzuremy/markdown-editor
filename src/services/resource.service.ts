import {IpcHandle, RegisterIpcHandlers} from "../decorators/ipc.decorator.ts";
import type {IpcMainEvent} from 'electron';
import {ResourceManager} from "../managers/ResourceManager.ts";
import {LanguageMap} from "../types/language.type.ts";
import {getLanguageMap} from "../utils/LanguageUtils.ts";
import {RESOURCE_NAME} from "../constants/resources.enum.ts";
import {IPC_CHANNELS} from "../constants/ipc.enum.ts";
import FileUtil from "../utils/FileUtil.ts";

/**
 * A class that handles resource-related operations for an Electron application.
 * The class provides methods to handle requests related to resources.
 *
 * This class is decorated with `@RegisterIpcHandlers`, which automatically registers
 * the IPC handlers defined in the class during instantiation.
 */
@RegisterIpcHandlers
export class ResourceHandlers {
    /**
     * Creates an instance of the ResourceHandlers class.
     *
     * @param resourceManager - An instance of the ResourceManager class responsible for
     *                          managing resource files and directories.
     */
    constructor(private readonly resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
    }

    /**
     * Handler for the "get resource path" operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.RESOURCE.GET_RESOURCE_PATH`.
     * It returns the path to a resource file or directory given the resource name.
     *
     * @param _
     * @param name - The name of the resource (can be `null` or `undefined`).
     * @returns The full path to the resource.
     */
    @IpcHandle(IPC_CHANNELS.RESOURCE.GET_RESOURCE_PATH)
    public getResourcePathHandler(_: IpcMainEvent, name: string | null | undefined): string {
        return this.resourceManager.getResourcePath(name);
    }

    /**
     * Handler for the "get language map" operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.RESOURCE.GET_LANGUAGE_MAP`.
     * It retrieves a language map by reading a specific resource file (typically a JSON file)
     * that contains language information.
     *
     * @returns A `Promise` that resolves to the language map.
     */
    @IpcHandle(IPC_CHANNELS.RESOURCE.GET_LANGUAGE_MAP)
    public async getLanguageMapHandler(): Promise<LanguageMap> {
        return await getLanguageMap(this.resourceManager.getResourcePath(RESOURCE_NAME.LOCALES));
    }

    /**
     * Handler for the "read JSON" operation.
     *
     * This method is triggered by the IPC channel defined in `IPC_CHANNELS.RESOURCE.READ_JSON`.
     * It reads a JSON file associated with a given resource name and filename and returns
     * the parsed object.
     *
     * @param _
     * @param resourceName - The name of the resource from which the JSON file should be read.
     * @param filename - The filename of the JSON file to read.
     * @returns The parsed JSON object, or `null` if the file could not be read.
     */
    @IpcHandle(IPC_CHANNELS.RESOURCE.READ_JSON)
    public async readJsonHandler(
        _: IpcMainEvent,
        resourceName: string,
        filename: string
    ): Promise<object | null> {
        const filepath = this.resourceManager.getFilePath(resourceName, filename);

        return await FileUtil.readJson(filepath);
    }
}