import {I18nInstance, TranslationResource} from "@/types/language.type.ts";
import {IPC_CHANNELS} from "@/constants/ipc.enum.ts";
import {RESOURCE_NAME} from "@/constants/resources.enum.ts";
import {EventEmitter} from "@/events/EventEmitter.ts";
import {EVENT_NAME} from "@/constants/events.enum.ts";
import {LOG_MODULE_NAME} from "@/constants/log.enum.ts";
import {LoggerProxy} from "@/logger/LoggerProxy.ts";
import {CONFIG_KEY} from "@/constants/config.enum.ts";
import {ConfigProxy} from "@utils/ConfigProxy.ts";
import {IpcHelper} from "@utils/IpcHelper.ts";

// fallback language
import FALLBACK_LANGUAGE from "./fallback.json";

/**
 * The I18n class provides internationalization (i18n) support by managing language resources
 * and handling the translation of keys to localized values. It supports dynamic language
 * switching and fallback mechanisms when the requested language is not available.
 */
class I18n extends EventEmitter implements I18nInstance {
    // Currently loaded language.
    private currentLang: string = 'en_us';
    // Store key-value pairs of language files.
    private readonly resources = new Map<string, string>();
    private readonly logger = new LoggerProxy(LOG_MODULE_NAME.I18N);

    /**
     * Initialize the I18n instance and event emitter.
     */
    constructor() {
        super();
    }

    /**
     * Initializes the I18n instance by loading the current language configuration.
     * This method should be called to set up the language settings upon application startup.
     * It retrieves the language code from the configuration and loads the corresponding language resources.
     */
    public async initialize(): Promise<void> {
        this.logger.info(`Initializing i18n...`);
        // Get the language used from the configuration.
        this.currentLang = await ConfigProxy.get(CONFIG_KEY.LANGUAGE, 'en_us') as string;

        await this.loadLanguage(this.currentLang, true);
    }

    /**
     * Retrieves the translation for the given key in the current language, with optional parameter formatting.
     * If the translation is not available in the current language, it falls back to a default language.
     *
     * @param key - The translation key to look up.
     * @param params - Optional parameters to substitute in the translation string (e.g., for placeholders).
     *
     * @returns The translated string, formatted with parameters if provided.
     * If the translation is not found, the original key is returned as a fallback.
     */
    public t(key: string, params?: Record<string, string | number>): string {
        const value = this.resources.get(key)
            || (FALLBACK_LANGUAGE as TranslationResource)[key];

        return value ? this.formatString(value, params) : key;
    }

    /**
     * Changes the language of the application. If the new language is different from the
     * current language, it loads the new language and emits a 'LANGUAGE_CHANGED' event.
     *
     * @param language - The new language code (e.g., 'en_us', 'zh_cn').
     */
    public async changeLanguage(language: string): Promise<void> {
        if (language !== this.currentLang) {
            await this.loadLanguage(language);
            // Save the language used.
            ConfigProxy.set(CONFIG_KEY.LANGUAGE, language);
            this.logger.info(`Language changed to: ${language}`);

            // Emit the event indicating that the language has changed.
            this.emit(EVENT_NAME.LANGUAGE_CHANGED, language);
        }
    }

    /**
     * Loads the language resources for the specified language if it differs from the current language.
     * If the specified language is already the current language and the `mandatory` flag is not set, the method will do nothing.
     *
     * In case the language resources are unavailable locally, the method will attempt to fetch the language file
     * from an external source (e.g., a server or local storage).
     *
     * Once the language file is successfully loaded, it will clear the existing resources, update the resources
     * with the new language data, and set the current language to the specified one.
     *
     * @param language - The language code to load (e.g., 'en_us', 'zh_cn'). The method will skip loading if
     *                   this language is already set as the current language, unless the `mandatory` flag is set.
     * @param [mandatory=false] - Optional flag that forces the language resources to load even if it's the current language.
     *                            Used only for loading language files during initialization.
     */
    private async loadLanguage(language: string, mandatory: boolean = false): Promise<void> {
        if (this.currentLang === language && !mandatory) return;

        try {
            const translation = await IpcHelper.request(
                IPC_CHANNELS.RESOURCE.READ_JSON, RESOURCE_NAME.LOCALES, `${language}.json`
            );

            if (translation) {
                // Override language object.
                this.resources.clear();
                for (const [key, value] of Object.entries(translation as TranslationResource)) {
                    this.resources.set(key, value);
                }

                this.currentLang = language;
                this.logger.info(`Languages loaded: ${language}.`);
            }
        } catch (error) {
            this.logger.error(`The language file ${language} is missing: `, error);
        }
    }


    /**
     * Formats a translation string by replacing placeholders with the provided parameters.
     *
     * @param template - The translation template containing placeholders (e.g., "Hello, {name}!").
     * @param params - The parameters to replace placeholders in the template.
     *
     * @returns The formatted string with placeholders replaced.
     */
    private formatString(template: string, params?: Record<string, string | number>): string {
        return params ? template.replace(/\{(\w+)}/g, (_, key) =>
            String(params[key] ?? `{${key}}`)
        ) : template;
    }

    /**
     * Gets the current language code being used in the application.
     *
     * @returns The current language code (e.g., 'en_us').
     */
    get getCurrentLanguage(): string {
        return this.currentLang;
    }
}

/**
 * Singleton instance of the I18n class.
 */
let i18nInstance: I18n | null = null;

/**
 * Initializes and returns the I18n instance. If the instance is already initialized,
 * it returns the existing instance.
 *
 * @returns The I18n instance.
 */
export async function initI18n(): Promise<I18nInstance> {
    if (!i18nInstance) {
        i18nInstance = new I18n();
        await i18nInstance.initialize();
    }

    return i18nInstance;
}

/**
 * Returns the current instance of I18n. Throws an error if the instance has not been initialized.
 *
 * @returns The I18n instance.
 * @throws Error if the I18n instance is not initialized.
 */
export async function getI18n(): Promise<I18nInstance> {
    if (!i18nInstance) {
        throw new Error('I18n instance not initialized');
    }

    return i18nInstance;
}
