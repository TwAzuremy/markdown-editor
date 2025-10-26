import React, {forwardRef, memo, ReactElement, useEffect, useState} from "react";
import {MdeTabDirection} from "./MdeTab.tsx";

import './mde-tab-list.scss';
import {StringUtil} from "@utils/StringUtil.ts";

/**
 * Props for the MdeTabList component.
 *
 * @param {MdeTabDirection} [direction='horizontal'] - The direction of the tabs (horizontal or vertical).
 * @param {ReactElement[]} tabs - A list of React elements representing the tab headers.
 * @param {number} [index=0] - The initial index of the active tab.
 * @param {function} [onTab] - A callback function that is called when a tab is clicked. It receives the tab index as an argument.
 * @param {boolean} [disabled=false] - If true, disables the tab list and prevents tab selection.
 */
type MdeTabListProps = {
    direction?: MdeTabDirection;
    tabs: ReactElement[];
    index?: number;
    onTab?: (index: number) => void;
    disabled?: boolean;
};

/**
 * The MdeTabList component renders a list of tabs that the user can click to switch between different views.
 * It allows for customizing the direction of the tabs, and supports a callback when a tab is clicked.
 * Optionally, the list can be disabled to prevent interaction.
 *
 * @param {MdeTabListProps} props - The properties for configuring the tab list behavior.
 * @param {React.Ref<HTMLDivElement>} ref - The forwarded reference to the tab list container.
 *
 * @returns {ReactElement} The rendered tab list component.
 */
const MdeTabList: React.FC<MdeTabListProps> =
    memo(forwardRef<HTMLDivElement, MdeTabListProps>((
        {
            tabs,
            index = 0,
            direction = 'horizontal',
            onTab,
            disabled = false,
            ...props
        }, ref) => {
        const [currentIndex, setCurrentIndex] = useState<number>(index);

        /**
         * Handles the click event on a tab.
         * If the tab list is not disabled, it triggers the `onTab` callback with the tab index.
         *
         * @param {number} index - The index of the clicked tab.
         */
        function handlerClick(index: number) {
            if (!disabled) {
                onTab?.(index);
                setCurrentIndex(index);
            }
        }

        return (
            <div className={"mde-tab__list"} {...props} ref={ref}>
                <div className={"mde-tab__list--slider"}></div>
                {tabs.map((tab, i) => (
                    <div
                        className={StringUtil.combinedClassName(
                            "mde-tab__list--item",
                            currentIndex === i ? `mde-tab__list--current` : ""
                        )}
                        key={i}
                        onClick={() => handlerClick(i)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
        );
    }));

export default MdeTabList;