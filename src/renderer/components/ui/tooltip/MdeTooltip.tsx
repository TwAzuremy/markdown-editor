import React, {memo} from "react";
import {StringUtil} from "@utils/StringUtil.ts";

import './mde-tooltip.scss';

/**
 * `MdeTooltipPosition` type
 *
 * Represents the possible positions for the tooltip relative to the target element.
 */
type MdeTooltipPosition = "top" | "bottom" | "left" | "right";

/**
 * `MdeTooltipProps` Interface
 *
 * Describes the properties accepted by the `MdeTooltip` component.
 *
 * @property {string | React.ReactElement} tip - The content to be displayed in the tooltip, can be a string or a React element.
 * @property {MdeTooltipPosition} [position="top"] - The position of the tooltip relative to the target element.
 * Can be 'top', 'bottom', 'left', or 'right'. Defaults to 'top'.
 */
type MdeTooltipProps = {
    /**
     * The content of the tooltip, which can be either a string or a React element.
     * This will be displayed when the tooltip is triggered.
     */
    tip: string | React.ReactElement;

    /**
     * The position of the tooltip relative to the target element.
     *
     * - `'top'`: Tooltip appears above the element.
     * - `'bottom'`: Tooltip appears below the element.
     * - `'left'`: Tooltip appears to the left of the element.
     * - `'right'`: Tooltip appears to the right of the element.
     *
     * Default is `'top'`.
     */
    position?: MdeTooltipPosition;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * `MdeTooltip` component
 *
 * Displays a tooltip with content specified via the `tip` prop, positioned relative to its target element.
 * The tooltip position can be customized via the `position` prop.
 *
 * @param {string | React.ReactElement} tip - The content of the tooltip. This can be a string or a React element.
 * @param {MdeTooltipPosition} [position="top"] - The position of the tooltip relative to the target element.
 * Can be 'top', 'bottom', 'left', or 'right'. Defaults to 'top'.
 *
 * @returns {JSX.Element} The rendered tooltip component.
 */
const MdeTooltip: React.FC<MdeTooltipProps> = memo((
    {
        tip,
        position = 'top',
        className,
        children,
        ...props
    }) => {
    return (
        <div
            className={StringUtil.combinedClassName(
                "mde-tooltip",
                `mde-tooltip__position--${position}`,
                className
            )}
            {...props}
        >
            {children}
            <p className={"mde-tooltip__text"}>{tip}</p>
        </div>
    );
});

export default MdeTooltip;