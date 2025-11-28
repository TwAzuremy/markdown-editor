import Store from 'electron-store';
import {ConfigSchema, WindowBounds} from "../types/config.type.ts";
import {ResourceManager} from "./ResourceManager.ts";
import {RESOURCE_NAME} from "../constants/resources.enum.ts";
import {CONFIG_KEY} from "../constants/config.enum.ts";

// Default configuration
import CONFIG_DEFAULT from './config.default.json';

/**
 * Class responsible for managing application settings and configuration.
 *
 * It uses Electron's Store module to persist configuration data and allows for retrieving, setting, and deleting configurations.
 * It also manages the default configuration values from a JSON file.
 */
export class ConfigManager {
    private static instance: ConfigManager;

    private readonly store: Store<ConfigSchema>;
    private readonly configPath: string;

    private readonly resourceManager: ResourceManager = ResourceManager.getInstance();

    /**
     * Creates an instance of the ConfigManager.
     *
     * Initializes the store with a path and default configuration, and watches for changes in the config file.
     */
    constructor() {
        this.configPath = this.resourceManager.getResourcePath(RESOURCE_NAME.CONFIG);
        this.store = new Store<ConfigSchema>({
            cwd: this.configPath,
            name: 'config',
            defaults: CONFIG_DEFAULT || {},
            clearInvalidConfig: true,
            watch: true
        });
    }

    /**
     * Initializes the ConfigManager as a singleton.
     *
     * If the instance does not already exist, it will be created.
     *
     * @returns The singleton instance of ConfigManager.
     */
    public static initialize(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }

        return ConfigManager.instance;
    }

    /**
     * Returns the singleton instance of ConfigManager.
     *
     * If the instance has not been initialized, throws an error.
     *
     * @returns The singleton instance of ConfigManager.
     * @throws {Error} If ConfigManager has not been initialized.
     */
    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            throw new Error('ConfigManager not initialized. Call initialize() first.');
        }

        return ConfigManager.instance;
    }

    /**
     * Retrieves a value from the store or the default configuration.
     *
     * If the value is found in the store, it is returned. If not, the method attempts to get the value from the default configuration.
     * If neither is found, the specified default value is returned.
     *
     * @param key - The key for the configuration value.
     * @param defaultValue - The default value to return if the key is not found in the store or default configuration.
     * @returns The value associated with the key, or the provided default value.
     */
    public get<T = unknown>(key: string, defaultValue?: T): T {
        const value = this.store.get(key);

        // Return the value from the store if it exists
        if (value !== undefined) {
            return value as T;
        }

        // Fallback to the default config if the value is not in the store
        const defaultConfigValue = this.getFromDefaultConfig(key);
        if (defaultConfigValue !== undefined) {
            return defaultConfigValue as T;
        }

        // Return the provided default value if neither store nor default config contains the key
        return defaultValue as T;
    }

    /**
     * Sets a configuration value in the store.
     *
     * @param key - The key for the configuration value.
     * @param value - The value to set for the specified key.
     */
    public set(key: string, value: unknown): void {
        this.store.set(key, value);
    }

    /**
     * Checks if the store contains a value for the given key.
     *
     * @param key - The key to check in the store.
     * @returns A boolean indicating whether the key exists in the store.
     */
    public has(key: string): boolean {
        return this.store.has(key);
    }

    /**
     * Deletes a configuration value from the store.
     *
     * @param key - The key of the value to delete from the store.
     */
    public delete(key: string): void {
        this.store.delete(key);
    }

    /**
     * Resets the store to its default configuration.
     *
     * This method clears all existing values in the store and then restores the store's configuration to the default values
     * defined in `CONFIG_DEFAULT`. This is useful for restoring the application to its initial state.
     */
    public reset(): void {
        this.store.clear();
        this.store.set(CONFIG_DEFAULT);
    }

    /**
     * Retrieves a value from the default configuration.
     *
     * This method looks up the key path in the default configuration object and returns the corresponding value.
     *
     * @param key - The key to search for in the default configuration, which can include dot notation for nested values.
     * @returns The value from the default configuration, or undefined if the key doesn't exist.
     *
     * @private
     */
    private getFromDefaultConfig(key: string): unknown {
        const keys = key.split('.');
        let current: unknown = CONFIG_DEFAULT;

        for (const k of keys) {
            if (current && typeof current === 'object' &&
                !Array.isArray(current) &&
                k in current) {
                // Use type guard to ensure `current` is a Record<string, unknown>
                current = (current as Record<string, unknown>)[k];
            } else {
                return undefined;
            }
        }

        return current;
    }

    /**
     * Sets the window bounds (size and position) in the store.
     *
     * @param bounds - The window bounds object containing width, height, x, and y coordinates.
     */
    public setWindowBounds(bounds: WindowBounds): void {
        this.store.set(CONFIG_KEY.WINDOW_BOUNDS, bounds);
    }

    /**
     * Retrieves the window bounds (size and position) from the store.
     *
     * @returns The window bounds object with width, height, x, and y coordinates.
     */
    public getWindowBounds(): WindowBounds {
        return this.get(CONFIG_KEY.WINDOW_BOUNDS) as WindowBounds;
    }
}