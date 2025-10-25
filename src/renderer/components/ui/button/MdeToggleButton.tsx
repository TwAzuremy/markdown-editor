import React, {ForwardedRef, forwardRef, memo, useEffect, useState} from "react";
import {StringUtil} from "@utils/StringUtil.ts";
import {componentSize} from "@/types/component.ts";

import './mde-toggle-button.scss';

/**
 * Button variants available for MdeToggleButton.
 * - 'primary': The default button variant with a solid background, used for primary actions.
 * - 'transparent': A button with a transparent background, often used for secondary or less prominent actions.
 */
type MdeToggleButtonVariant = 'primary' | 'transparent';

/**
 * Properties that MdeToggleButton component accepts.
 */
type MdeToggleButtonProps = {
    /**
     * Defines the size of the toggle button.
     * - 'small': Smaller toggle button size.
     * - 'medium': Default medium size.
     * - 'large': Larger toggle button size.
     */
    size?: componentSize;

    /**
     * Defines the variant of the toggle button.
     * - 'primary': The primary style variant for most important actions.
     * - 'transparent': A transparent toggle button style.
     */
    variant?: MdeToggleButtonVariant;

    /**
     * The icon to display when the button is in its inactive state.
     * This can be any valid React component element representing an icon.
     */
    icon: React.ReactElement;

    /**
     * The icon to display when the button is in its active state.
     * This can be any valid React component element representing an icon.
     */
    activeIcon: React.ReactElement;

    /**
     * Determines if the toggle button is in the active state.
     * - true: The button is active, displaying the active icon.
     * - false: The button is inactive, displaying the default icon.
     * Default is false if not provided.
     */
    isActive?: boolean;

    /**
     * Determines if the toggle button should be disabled.
     * A disabled button will not trigger any actions when clicked.
     */
    disabled?: boolean;

    /**
     * A callback function triggered when the button is toggled.
     * The `checked` argument reflects the new state of the button (true for active, false for inactive).
     */
    onSwitch?: (checked: boolean) => void;

    /**
     * A forwarded ref to the label element, allowing the parent component to directly access the DOM element.
     * Useful for manipulating the button element, such as focusing or measuring its size.
     */
    ref?: ForwardedRef<HTMLLabelElement>;
} & React.HTMLAttributes<HTMLLabelElement>;

/**
 * `MdeToggleButton` is a custom toggle switch component that supports state toggling, disabled state, and custom icons.
 *
 * The component uses a `checkbox` input to manage the toggle state, and allows external control of its initial state and synchronization of state changes through the `isActive` prop.
 *
 * The component offers various customization options, including size (`size`), variant (`variant`), icons (`icon`, `activeIcon`), and a disabled state (`disabled`).
 *
 * @param {string} [size='medium'] - Controls the size of the button. Supported values are 'small', 'medium', 'large'.
 * @param {string} [variant='primary'] - Controls the style variant of the button. Supported values are 'primary', 'secondary', etc.
 * @param {React.ReactNode} [icon] - The icon to display when the button is not active. It is best to add a `fixedSize` attribute.
 * @param {React.ReactNode} [activeIcon] - The icon to display when the button is active.
 * @param {boolean} [isActive=false] - Controls the initial state of the toggle button. `true` means active, `false` means inactive.
 * @param {boolean} [disabled=false] - Disables the button if `true`, preventing user interaction.
 * @param {function} [onSwitch] - A callback function that is called when the toggle state changes. It receives a boolean representing the current state.
 * @param {string} [className] - Additional custom class names for further styling of the component.
 *
 * @returns {JSX.Element} The rendered `MdeToggleButton` component.
 *
 * @example
 * <MdeToggleButton
 *     icon={<MdeIcon name={'moon'} fixedSize/>}
 *     activeIcon={<MdeIcon name={'sun'} fixedSize/>}
 * />
 */
const MdeToggleButton: React.FC<MdeToggleButtonProps> =
    memo(forwardRef<HTMLLabelElement, MdeToggleButtonProps>((
        {
            size = 'medium',
            variant = 'primary',
            icon,
            activeIcon,
            isActive = false,
            disabled = false,
            onSwitch,
            className,
            ...props
        }, ref) => {
        const [isChecked, setIsChecked] = useState(isActive);

        /**
         * Handles the change event for the toggle switch input.
         *
         * This function is triggered when the user toggles the switch (checkbox).
         * It updates the internal state (`isChecked`) and calls the `onSwitch` callback
         * to notify the parent component of the new toggle state.
         *
         * @param {React.ChangeEvent<HTMLInputElement>} event - The change event triggered by the toggle switch.
         */
        function change(event: React.ChangeEvent<HTMLInputElement>) {
            // Get the new checked state of the checkbox.
            const checked = event.currentTarget.checked;

            onSwitch?.(checked);
            setIsChecked(checked);
        }

        // Synchronize changes to external isActive prop
        useEffect(() => {
            setIsChecked(isActive);
        }, [isActive]);

        return (
            <label
                className={StringUtil.combinedClassName(
                    "mde-toggle-button",
                    `mde-toggle-button__size--${size}`,
                    `mde-toggle-button__variant--${variant}`,
                    className
                )}
                ref={ref}
                {...props}
            >
                <input type="checkbox" checked={isChecked} disabled={disabled} onChange={change}/>
                {icon}
                {activeIcon}
            </label>
        );
    }));

export default MdeToggleButton;