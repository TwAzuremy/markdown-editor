import React, {memo} from "react";
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
 */
type MdeTextProps = {
    // The translation key for retrieving the text
    tKey: string;
    // Flag to control whether to skip translation and render the key directly
    noTranslate?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>;

/**
 * `MdeText` is a React functional component used to render translatable text within a UI.
 * It uses the `useI18n` hook to fetch translations based on the provided `tKey`.
 * Optionally, it can skip translation and display the raw `tKey` if the `noTranslate` prop is set to `true`.
 * This is useful for rendering keys as placeholders or static text.
 *
 * @param {string} tKey - The translation key to look up in the i18n context.
 * @param {boolean} [noTranslate=false] - Optional flag to prevent translation and render the key directly. Defaults to `false`.
 *
 * @returns {JSX.Element} A `span` element containing either the translated text or the raw `tKey`.
 *
 * @example
 * ```tsx
 * <MdeText tKey={'app.xxx.welcome'}/>
 * <MdeText tKey={'hello world'} noTranslate/>
 * ```
 */
const MdeText: React.FC<MdeTextProps> =
    memo(({tKey, noTranslate = false, className, ...props}) => {
        const {t} = useI18n();
        const text = noTranslate ? tKey : t(tKey);

        return (
            <span className={StringUtil.combinedClassName('mde-text', className)}
                  {...props}>{text}</span>
        );
    });

export default MdeText;