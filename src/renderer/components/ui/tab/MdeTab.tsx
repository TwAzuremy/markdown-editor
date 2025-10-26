import React, {
    Children,
    ForwardedRef,
    forwardRef,
    memo,
    ReactElement, useCallback, useEffect,
    useMemo,
    useRef, useState
} from "react";
import {StringUtil} from "@utils/StringUtil.ts";
// TODO [Reserved] Styles for the vertical direction have not been implemented yet. (list, content)
import MdeTabList from "./MdeTabList.tsx";
import MdeTabContent, {MdeTabContentRef} from "./MdeTabContent.tsx";
import {HtmlCssUtil} from "@utils/HtmlCssUtil.ts";
import {useAnimationFrame} from "@renderer/hook/useAnimationFrame.ts";

import './mde-tab.scss';

/**
 * Represents the possible directions of the tab layout: either 'vertical' or 'horizontal'.
 */
export type MdeTabDirection = 'vertical' | 'horizontal';

/**
 * Props for the MdeTab component.
 *
 * @param {MdeTabDirection} [direction='horizontal'] - The direction of the tab layout (horizontal or vertical).
 * @param {number} [index=0] - The initial index of the active tab.
 * @param {React.Ref<HTMLDivElement>} [ref] - A forwarded reference to the tab container.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Any other HTML attributes to apply to the tab container.
 */
type MdeTabProps = {
    direction?: MdeTabDirection;
    index?: number;
    ref?: ForwardedRef<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * The MdeTab component is a wrapper for a tabbed interface that includes both the tab list and tab content.
 * It supports both vertical and horizontal tab layouts and handles switching between tabs with smooth transitions.
 *
 * @param {MdeTabProps} props - The properties for configuring the tab behavior.
 * @param {React.Ref<HTMLDivElement>} ref - The forwarded reference to the tab container.
 *
 * @returns {ReactElement} The rendered tab component.
 */
const MdeTab = memo(forwardRef<HTMLDivElement, MdeTabProps>((
    {
        direction = 'horizontal',
        index = 0,
        children,
        className,
        ...props
    }, ref) => {
    const containerRef = useRef<MdeTabContentRef>(null);
    const [tabDisabled, setTabDisabled] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(index);
    const {start, cancel} = useAnimationFrame();

    /**
     * Split the children into tabs and containers, assuming that tabs are at even indices and containers are at odd indices.
     */
    const {tabs, containers} = useMemo(() => {
        const childrenArray = Children.toArray(children) as ReactElement[];
        const tabsArray: ReactElement[] = [];
        const containersArray: ReactElement[] = [];

        childrenArray.forEach((child, i) => {
            i % 2 === 0 ? tabsArray.push(child) : containersArray.push(child);
        });

        return {tabs: tabsArray, containers: containersArray};
    }, [children]);

    /**
     * Handles the tab switching logic. If a tab is clicked, it ensures that the new tab is visible and animates the transition.
     *
     * @param {number} tabIndex - The index of the tab that was clicked.
     */
    const handlerTab = useCallback((tabIndex: number) => {
        const currentIndex = containerRef.current?.getCurrentVisibleContainer();
        if (currentIndex === tabIndex || tabDisabled) return;

        // Due to the complexity of implementing the animation,
        // the tab is temporarily disabled here for the sake of animation integrity.
        setTabDisabled(true);
        const delay = StringUtil.convertToMilliseconds(
            HtmlCssUtil.getRootVariable('--duration-micro-interaction')
        ) || 200;

        setCurrentIndex(tabIndex);
        containerRef.current?.showContainer(tabIndex, delay);
        start(() => setTabDisabled(false), delay);
    }, [start, tabDisabled]);

    useEffect(() => () => cancel(), [cancel]);

    // Container used to control the display.
    const cssVars = {
        '--tab-number': containers.length,
        '--tab-current': currentIndex
    };

    return (
        <div
            className={StringUtil.combinedClassName(
                "mde-tab",
                `mde-tab__direction--${direction}`,
                className
            )}
            style={cssVars}
            {...props}
            ref={ref}
        >
            <MdeTabList
                tabs={tabs}
                direction={direction}
                index={index}
                onTab={handlerTab}
                disabled={tabDisabled}
            />
            <MdeTabContent
                containers={containers}
                direction={direction}
                index={index}
                ref={containerRef}
            />
        </div>
    );
}));

export default MdeTab;