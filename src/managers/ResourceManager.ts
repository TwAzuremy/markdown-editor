import path from 'path';
import fs from 'fs';
import {app, App} from 'electron';
import * as process from "node:process";
import {ResourceConfig} from "../types/resource.ts";
import FileUtil from "../utils/FileUtil.ts";

export class ResourceManager {
    private readonly isPackaged: boolean;
    private app: App;
    private readonly resourceConfig: ResourceConfig;

    constructor(appInstance: App, config: ResourceConfig = {}) {
        this.app = appInstance;
        this.isPackaged = appInstance.isPackaged;
        this.resourceConfig = {
            ...config
        };

        // Automatically create resource folder.
        // noinspection JSIgnoredPromiseFromCall
        this.ensureResourceDirs();
    }

    /**
     * Get the base path of resources
     *
     * @returns {string} The base path of resources
     */
    public getBasePath(): string {
        // If packaged, return the path in the production environment;
        // otherwise, return the path in the development environment.
        return this.isPackaged ? process.resourcesPath! : this.app.getAppPath();
    }

    /**
     * Ensure all resource directories exist by creating them if necessary
     */
    public async ensureResourceDirs(): Promise<void> {
        const resourceNames = Object.keys(this.resourceConfig);

        await Promise.all(resourceNames.map(name =>
            FileUtil.checkFolderExists(this.getResourcePath(name), true)
        ));
    }

    /**
     * Get the absolute path of the specified resource.
     *
     * If the resourceName is undefined or null, return the base path of resources.
     *
     * @param resourceName Resource name (e.g., 'locales', 'config')
     * @returns {string} The absolute path of the resource
     * @throws {Warning} If the resource is not configured
     */
    public getResourcePath(resourceName: string | null | undefined): string {
        if (!resourceName) return this.getBasePath();

        const relativePath = this.resourceConfig[resourceName];
        if (!relativePath) console.warn(`Resource '${resourceName}' is not configured.`);

        const resourceBase = this.isPackaged ?
            this.getBasePath() : path.join(this.getBasePath(), 'src', 'resources');
        return path.join(resourceBase, relativePath || resourceName);
    }

    /**
     * Get the absolute path of the specified file in the resource directory.
     *
     * @param resourceName Resource name (e.g., 'locales', 'config')
     * @param filename File name
     * @return The absolute path of the file
     */
    public getFilePath(resourceName: string | null | undefined, filename: string): string {
        const resourcePath = this.getResourcePath(resourceName);

        return path.join(resourcePath, filename);
    }

    /**
     * Check if the resource path exists
     *
     * @param resourceName Resource name
     * @returns {boolean} True if the resource path exists, false otherwise
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
     * Read the contents of the resource file
     *
     * @param resourceName Resource name
     * @param filename File name
     * @param encoding File encoding, default is 'utf-8'
     * @returns {string | null} The contents of the resource file, or null if the file does not exist
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
            console.error(`Error reading file ${filename} from ${resourceName}: `, error);
            return null;
        }
    }

    /**
     * Read JSON file
     *
     * @param resourceName Resource name
     * @param filename File name
     * @returns {T | null} The JSON, or null if the file does not exist
     */
    public readJsonFile<T = unknown>(resourceName: string | null | undefined, filename: string): T | null {
        try {
            const content = this.readResourceFile(resourceName, filename);

            return content ? JSON.parse(content) as T : null;
        } catch (error) {
            console.error(`Error parsing JSON from ${filename}: `, error);
            return null;
        }
    }
}

let resourceManager: ResourceManager | null = null;

/**
 * Initialize Resource Manager
 *
 * @param config Resource configuration
 */
export function initResourceManager(config?: ResourceConfig): ResourceManager {
    if (!resourceManager) {
        resourceManager = new ResourceManager(app, config);
    }

    return resourceManager;
}

/**
 * Get an instance of the Resource Manager
 */
export function getResourceManager(): ResourceManager {
    if (!resourceManager) {
        throw new Error('ResourceManager not init. Call initResourceManager first');
    }

    return resourceManager;
}

export default ResourceManager;