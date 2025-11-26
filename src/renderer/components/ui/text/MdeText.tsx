import React from "react";
import {useI18n} from "@renderer/hook/useI18n.ts";
import {StringUtil} from "@utils/StringUtil.ts";

import "./mde-text.scss";

/**
 * `MdeTextProps` Interface
 *
 * Describes the properties accepted by the `MdeText` component.
 *
 * @property {string} tKey - The key used to fetch the corresponding text from the translation context.
 * @property {boolean} [noTranslate=false] - Optional flag that, if set to true, skips translation and renders the translation key as text.
 * @property {boolean} [canSelect=true] - Optional flag that controls whether the text can be selected. If true, the text can be selected, otherwise it is non-selectable.
 */
type MdeTextProps = {
    // The translation key for retrieving the text
    tKey: string;
    // Flag to control whether to skip translation and render the key directly
    noTranslate?: boolean;
    canSelect?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>;

/**
 * `MdeText` is a React functional component used to render translatable text within a UI.
 * It uses the `useI18n` hook to fetch translations based on the provided `tKey`.
 * Optionally, it can skip translation and display the raw `tKey` if the `noTranslate` prop is set to `true`.
 * This is useful for rendering keys as placeholders or static text.
 *
 * @param tKey - The translation key to look up in the i18n context.
 * @param [noTranslate=false] - Optional flag to prevent translation and render the key directly. Defaults to `false`.
 * @param [canSelect=true] - Optional flag used to enable text selection. The default value is `true`.
 *
 * @param className
 * @param props
 *
 * @returns A `span` element containing either the translated text or the raw `tKey`.
 *
 * @example
 * ```tsx
 * <MdeText tKey={'app.xxx.welcome'}/>
 * <MdeText tKey={'hello world'} noTranslate/>
 * ```
 */
const MdeText: React.FC<MdeTextProps> =
    ({tKey, noTranslate = false, canSelect = true, className, ...props}) => {
        const {t} = useI18n();
        const text = noTranslate ? tKey : t(tKey);

        return (
            <span
                className={StringUtil.combinedClassName(
                    'mde-text', canSelect ? undefined : 'non-selectable', className
                )}
                {...props}>
                {text}
            </span>
        );
    };

export default MdeText;