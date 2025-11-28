import {useCallback, useEffect, useState} from "react";
import {I18nInstance} from "@/types/language.ts";
import {getI18n} from "@/i18n/main.ts";
import {EVENT_NAME} from "@/constants/events.enum.ts";
import {Logger} from "@/logger/Logger.ts";
import {LOG_MODULE_NAME} from "@/constants/log.enum.ts";

/**
 * A custom React hook that manages the state of the internationalization (i18n) instance,
 * loading status, and errors. It provides functions to translate strings (`t`) and change
 * the current language (`changeLanguage`). It also provides the loading state and any errors
 * that may have occurred during initialization.
 *
 * @returns An object containing:
 * - `i18n`: The current `I18nInstance` (or null if not initialized).
 * - `t`: A function to translate a key into the current language.
 * - `loading`: A boolean indicating whether the i18n instance is still being initialized.
 * - `changeLanguage`: A function to change the current language.
 * - `error`: Any error that occurred during initialization (or null if no error).
 */
export function useI18n() {
    const [i18nState, setI18nState] = useState<{ instance: I18nInstance | null }>({instance: null});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    /**
     * A function to translate a given key using the current i18n instance.
     * If the instance is not initialized, it returns the key itself.
     *
     * @param key - The translation key to look up.
     * @param params - Optional parameters to format the translated string.
     * @returns The translated string, or the key if not found.
     */
    const t = useCallback((
        key: string, params?: Record<string, string | number>) => {
        if (!i18nState.instance) return key;
        return i18nState.instance.t(key, params);
    }, [i18nState.instance]);

    /**
     * A function to change the current language of the i18n instance.
     *
     * @param language - The language code to switch to (e.g., 'en_us', 'fr_fr').
     */
    const changeLanguage = useCallback(async (language: string) => {
        if (!i18nState.instance) return;

        try {
            await i18nState.instance.changeLanguage(language);
        } catch (error) {
            Logger.error(LOG_MODULE_NAME.I18N, 'Failed to change language: ', error);
        }
    }, [i18nState.instance]);

    useEffect(() => {
        let mounted = true;
        let cleanup: (() => void) | undefined;

        const initI18n = async () => {
            try {
                const instance = await getI18n();

                if (!mounted) return;

                const handleLanguageChange = () => {
                    // Trigger an update when the language changes
                    setI18nState(prev => ({...prev}));
                };

                // Register the event listener for language change
                instance.on(EVENT_NAME.LANGUAGE_CHANGED, handleLanguageChange);
                cleanup = () => instance.off(EVENT_NAME.LANGUAGE_CHANGED, handleLanguageChange);

                setI18nState({instance});
                setLoading(false);
            } catch (error) {
                if (mounted) {
                    setError(error as Error);
                    setLoading(false);
                }
            }
        };

        // noinspection JSIgnoredPromiseFromCall
        initI18n();

        return () => {
            mounted = false;
            cleanup?.();
        };
    }, []);

    return {
        i18n: i18nState.instance,
        t,
        loading,
        changeLanguage,
        error
    };
}
