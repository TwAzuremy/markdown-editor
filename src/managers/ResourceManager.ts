import path from 'path';
import fs from 'fs';
import {app, App} from 'electron';
import * as process from "node:process";
import {ResourceConfig} from "../types/resource.ts";
import {Logger} from "../logger/Logger.ts";
import {LOG_MODULE_NAME} from "../constants/log.enum.ts";

export class ResourceManager {
    private static instance: ResourceManager;
    private app: App;
    private readonly isPackaged: boolean;
    private readonly resourceConfig: ResourceConfig;
    private readonly logger: Logger = new Logger(LOG_MODULE_NAME.MAIN);

    /**
     * Initializes the ResourceManager instance.
     *
     * @param appInstance The instance of the app.
     * @param config Configuration for resources, defaults to an empty object.
     */
    constructor(appInstance: App, config: ResourceConfig = {}) {
        this.app = appInstance;
        this.isPackaged = appInstance.isPackaged;
        this.resourceConfig = {
            ...config
        };

        // Automatically create resource folder.
        this.ensureResourceDirsSync();
    }

    /**
     * Initializes the ResourceManager instance as a singleton.
     * This method will create a new instance only if it's not already initialized.
     *
     * @param appInstance The instance of the app (optional).
     * @param config Configuration for resources (optional).
     * @returns The ResourceManager instance.
     */
    public static initialize(appInstance: App = app, config?: ResourceConfig): ResourceManager {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager(appInstance, config);
        }

        return ResourceManager.instance;
    }

    /**
     * Gets the singleton instance of ResourceManager.
     * Throws an error if the instance is not initialized.
     *
     * @returns The ResourceManager instance.
     * @throws {Error} If ResourceManager is not initialized.
     */
    public static getInstance(): ResourceManager {
        if (!ResourceManager.instance) {
            throw new Error('ResourceManager not initialized. Call initialize() first.');
        }

        return ResourceManager.instance;
    }

    /**
     * Retrieves the base path of resources depending on whether the app is packaged.
     *
     * @returns The base path of resources
     */
    public getBasePath(): string {
        // If packaged, return the path in the production environment;
        // otherwise, return the path in the development environment.
        return this.isPackaged ? process.resourcesPath! : this.app.getAppPath();
    }

    /**
     * Ensures that the resource directories exist by creating them if necessary.
     * Iterates over all resources defined in the configuration and ensures their corresponding directories exist.
     */
    public ensureResourceDirsSync(): void {
        const resourceNames = Object.keys(this.resourceConfig);

        for (const name of resourceNames) {
            const resourcePath = this.getResourcePath(name);

            if (!fs.existsSync(resourcePath)) {
                fs.mkdirSync(resourcePath, {recursive: true});
            }
        }
    }

    /**
     * Retrieves the absolute path for the specified resource.
     * If no resource name is provided, the base path of resources is returned.
     *
     * @param resourceName The name of the resource (e.g., 'locales', 'config').
     * @returns The absolute path of the resource.
     */
    public getResourcePath(resourceName: string | null | undefined): string {
        if (!resourceName) return this.getBasePath();

        const relativePath = this.resourceConfig[resourceName];
        if (!relativePath) this.logger.warn(`Resource '${resourceName}' is not configured.`);

        const resourceBase = this.isPackaged ?
            this.getBasePath() : path.join(this.getBasePath(), 'src', 'resources');
        return path.join(resourceBase, relativePath || resourceName);
    }

    /**
     * Retrieves the absolute path for a specified file within the resource directory.
     *
     * @param resourceName The name of the resource (e.g., 'locales', 'config').
     * @param filename The name of the file within the resource.
     * @returns The absolute path of the specified file.
     */
    public getFilePath(resourceName: string | null | undefined, filename: string): string {
        const resourcePath = this.getResourcePath(resourceName);

        return path.join(resourcePath, filename);
    }

    /**
     * Checks if the specified resource path exists.
     *
     * @param resourceName The name of the resource.
     * @returns {boolean} True if the resource path exists, otherwise false.
     */
    public resourceExists(resourceName: string): boolean {
        try {
            const resourcePath = this.getResourcePath(resourceName);

            return fs.existsSync(resourcePath);
        } catch {
            return false;
        }
    }

    /**
     * Reads the contents of a specified resource file.
     *
     * @param resourceName The name of the resource (e.g., 'locales', 'config').
     * @param filename The name of the file to be read.
     * @param encoding The encoding of the file, default is 'utf-8'.
     * @returns The contents of the file as a string, or null if the file does not exist.
     */
    public readResourceFile(
        resourceName: string | null | undefined,
        filename: string,
        encoding: BufferEncoding = 'utf-8'
    ): string | null {
        try {
            const filePath = this.getFilePath(resourceName, filename);

            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, encoding);
            }

            return null;
        } catch (error) {
            this.logger.error(`Error reading file ${filename} from ${resourceName}: `, error);
            return null;
        }
    }

    /**
     * Reads and parses a JSON file from the resource directory.
     *
     * @param resourceName The name of the resource (e.g., 'locales', 'config').
     * @param filename The name of the JSON file to be read.
     * @returns The parsed JSON object, or null if the file does not exist or an error occurs.
     */
    public readJsonFile<T = unknown>(resourceName: string | null | undefined, filename: string): T | null {
        try {
            const content = this.readResourceFile(resourceName, filename);

            return content ? JSON.parse(content) as T : null;
        } catch (error) {
            this.logger.error(`Error parsing JSON from ${filename}: `, error);
            return null;
        }
    }
}