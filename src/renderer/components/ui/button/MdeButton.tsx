import React, {ForwardedRef, forwardRef} from "react";
import {componentSize} from "@/types/component.type.ts";
import {StringUtil} from "@utils/StringUtil.ts";

import "./mde-button.scss";

/**
 * Button variants available for MdeButton.
 * - 'primary': A standard button variant for main actions.
 * - 'transparent': A transparent button variant, typically used for less prominent actions.
 */
type MdeButtonVariant = 'primary' | 'transparent';

/**
 * Properties that MdeButton component accepts.
 */
type MdeButtonProps = {
    /**
     * Defines the size of the button.
     * - 'small': Smaller button size.
     * - 'medium': Default medium size.
     * - 'large': Larger button size.
     */
    size?: componentSize;

    /**
     * Defines the variant of the button.
     * - 'primary': The primary style variant for most important actions.
     * - 'transparent': A transparent button style.
     */
    variant?: MdeButtonVariant;

    /**
     * An optional icon to display in the button.
     * It can be any valid React component element representing an icon.
     */
    icon?: React.ReactElement;

    /**
     * Position of the icon relative to the text.
     * - 'left': Displays the icon to the left of the text.
     * - 'right': Displays the icon to the right of the text.
     */
    iconPosition?: 'left' | 'right';

    /**
     * Optional text element to be rendered inside the button.
     * This can be any valid React component that renders text.
     */
    text?: React.ReactElement;

    /**
     * Determines if the button should be disabled.
     * A disabled button will not trigger any actions when clicked.
     */
    disabled?: boolean;

    /**
     * A forwarded ref to the button element, allowing the parent component to directly access the DOM element.
     * Useful for manipulating the button element, such as focusing or measuring its size.
     */
    ref?: ForwardedRef<HTMLButtonElement>
} & React.HTMLAttributes<HTMLButtonElement>;

/**
 * A customizable button component that can render both an icon and/or text.
 * It supports different button sizes, variants, and icon positioning.
 *
 * @param {string} [size='medium'] - The size of the button. Can be 'small', 'medium', or 'large'. Default is 'medium'.
 * @param {string} [variant='transparent'] - The button variant. Determines the button's visual style. Default is 'transparent'.
 * @param {React.ReactElement} [icon] - The icon to display inside the button. Can be a React element, an SVG, or any other valid JSX element.
 * @param {string} [iconPosition='left'] - Position of the icon relative to the text. Can be 'left' or 'right'. Default is 'left'.
 * @param {React.ReactElement} [text] - The text to display inside the button. Can be a string or any valid JSX element.
 *
 * @returns {React.FC} A styled button element with optional icon and text.
 *
 * @example
 * <MdeButton
 *     text={<MdeText tKey={'app.xxx.text'}/>}
 * />
 * <MdeButton
 *     icon={<MdeIcon name={'home'}/>}
 *     text={<MdeText tKey={'app.xxx.home'}/>}
 * />
 */
const MdeButton: React.FC<MdeButtonProps> =
    forwardRef<HTMLButtonElement, MdeButtonProps>((
        {
            size = 'medium',
            variant = 'transparent',
            icon,
            iconPosition = 'left',
            text,
            disabled,
            className,
            onClick,
            ...props
        }, ref) => {
        /**
         * Renders the content of the button.
         * It renders either text, icon, or both based on the provided props.
         * If both icon and text are provided, it renders them based on the iconPosition prop.
         *
         * @returns {React.ReactElement | undefined} The rendered button content (text, icon, or both).
         */
        const render = (): React.ReactElement | undefined => {
            // If no text, return only the icon.
            if (!text) return icon;
            // If no icon, return only the text.
            if (!icon) return text;

            // If both icon and text are provided, render them in the correct order based on iconPosition.
            return (
                <>
                    {iconPosition === 'left' ? icon : text}
                    {iconPosition === 'left' ? text : icon}
                </>
            );
        };

        return (
            <button
                className={StringUtil.combinedClassName(
                    'mde-button',
                    `mde-button__size--${size}`,
                    `mde-button__variant--${variant}`,
                    className
                )}
                ref={ref}
                {...props}
                onClick={onClick}
                disabled={disabled}
            >
                {render()}
            </button>
        );
    });

export default MdeButton;