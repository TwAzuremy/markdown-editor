import {EventEmitter} from "./event.type.ts";

/**
 * Represents a map of language codes to their respective language names or identifiers.
 * The key is the language code (e.g., 'en_us'), and the value is the name or description of the language.
 */
export interface LanguageMap {
    [code: string]: string;
}

/**
 * Represents a translation resource, which is a map of translation keys to their corresponding translated strings.
 * Each key is a unique identifier for a specific translation (e.g., 'hello', 'welcome'), and the value is the translated string.
 */
export interface TranslationResource {
    [key: string]: string;
}

/**
 * Defines the interface for an I18n instance that extends the EventEmitter.
 * This interface ensures that the I18n instance supports translation, language changing, and event handling.
 */
export interface I18nInstance extends EventEmitter {
    /**
     * Translates a key into the current language, optionally formatting it with parameters.
     *
     * @param key - The translation key.
     * @param params - Optional parameters to format the translation string.
     *
     * @returns The translated string, or the key if not found.
     */
    t: (key: string, params?: Record<string, string | number>) => string;

    /**
     * Changes the language of the application to the specified language.
     *
     * @param language - The language code to switch to (e.g., 'en_us', 'fr_fr').
     *
     * @returns A promise that resolves once the language is successfully changed.
     */
    changeLanguage: (language: string) => Promise<void>;

    /**
     * Gets the current language code being used in the application.
     *
     * @returns The current language code (e.g., 'en_us').
     */
    getCurrentLanguage: string;
}
