import path from 'path';
import fs from 'fs';
import {app, App} from 'electron';
import * as process from "node:process";
import {ResourceConfig} from "../types/resource.type.ts";
import {logger} from "../main/main.ts";

export class ResourceManager {
    private static instance: ResourceManager;
    private app: App;
    private readonly isPackaged: boolean;
    private readonly resourceConfig: ResourceConfig;

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
        if (!relativePath) logger.warn(`Resource '${resourceName}' is not configured.`);

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
}