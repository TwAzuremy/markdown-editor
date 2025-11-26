import React, {
    ForwardedRef,
    forwardRef,
    ReactElement,
    useCallback,
    useEffect,
    useImperativeHandle, useRef,
    useState
} from "react";
import {MdeTabDirection} from "./MdeTab.tsx";
import {useAnimationFrame} from "@renderer/hook/useAnimationFrame.ts";
import {StringUtil} from "@utils/StringUtil.ts";

import './mde-tab-content.scss';

/**
 * Props for the MdeTabContent component.
 *
 * @param {MdeTabDirection} [direction='horizontal'] - The direction of the tabs (horizontal or vertical).
 * @param {ReactElement[]} containers - A list of React elements that represent the tab contents.
 * @param {number} [index=0] - The initial index of the visible tab container.
 * @param {boolean} [noTransition=false] - If true, disables transition effects when switching tabs.
 * @param {ForwardedRef<MdeTabContentRef>} [ref] - A forwarded reference to access the tab's methods.
 */
type MdeTabContentProps = {
    direction?: MdeTabDirection;
    containers: ReactElement[];
    index?: number;
    noTransition?: boolean;
    ref?: ForwardedRef<MdeTabContentRef>;
};

/**
 * Ref methods available for MdeTabContent.
 * Used with forwardedRef to control tab content visibility and manage tabs.
 */
export type MdeTabContentRef = {
    /**
     * Shows a specific tab container.
     *
     * @param {number} index - The index of the container to show.
     * @param {number} [delay=200] - Optional delay in milliseconds before hiding the previous tab.
     */
    showContainer: (index: number, delay?: number) => void;

    /**
     * Hides a specific tab container.
     *
     * @param {number} index - The index of the container to hide.
     */
    hideContainer: (index: number) => void;

    /**
     * Returns the index of the currently visible container.
     *
     * @returns {number} - The index of the current visible container.
     */
    getCurrentVisibleContainer: () => number;
};

/**
 * The MdeTabContent component that manages tab content visibility, and allows controlling tab switching.
 * Supports direction (horizontal/vertical), and optional transition effects.
 * Uses the requestAnimationFrame API to manage smooth tab transitions with optional delays.
 *
 * @param {MdeTabContentProps} props - The properties for configuring the tab behavior.
 * @param {ForwardedRef<MdeTabContentRef>} ref - The forwarded reference to control tab methods.
 *
 * @returns {ReactElement} The rendered tab content component.
 */
const MdeTabContent: React.FC<MdeTabContentProps> = forwardRef<MdeTabContentRef, MdeTabContentProps>((
    {
        containers,
        index = 0,
        direction = 'horizontal',
        noTransition = false,
        ...props
    }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleContainerIndices, setVisibleContainerIndices] = useState<Set<number>>(
        new Set([index])
    );
    const {start, cancel} = useAnimationFrame();

    /**
     * Hides a container based on its index.
     *
     * @param {number} hideIndex - The index of the container to hide.
     */
    const hideContainer = useCallback((hideIndex: number) => {
        setVisibleContainerIndices(prev => {
            const newSet = new Set(prev);
            newSet.delete(hideIndex);
            return newSet;
        });
    }, []);

    /**
     * Shows a specific container based on the provided index and optional delay.
     * If transition is enabled, the previous container will be hidden after the specified delay.
     *
     * @param {number} newIndex - The index of the container to show.
     * @param {number} [delay=200] - Optional delay in milliseconds before hiding the current container.
     */
    const showContainer = useCallback((newIndex: number, delay = 200) => {
        const [currentIndex] = Array.from(visibleContainerIndices);

        if (currentIndex === newIndex || newIndex < 0 || newIndex >= containers.length) return;

        // Achieve opacity transitions in CSS by changing class names.
        containerRef.current?.children[currentIndex]?.classList?.add("hidden");
        containerRef.current?.children[newIndex]?.classList?.remove("hidden");

        if (!noTransition) {
            start(() => {
                hideContainer(currentIndex);
            }, delay);
        }

        // Update the current index immediately to ensure the animation order is correct
        setVisibleContainerIndices(prev => new Set([...prev, newIndex]));
    }, [containers.length, hideContainer, noTransition, start, visibleContainerIndices]);

    useImperativeHandle(ref, () => ({
        showContainer,
        hideContainer,
        getCurrentVisibleContainer: () => {
            const [currentIndex] = Array.from(visibleContainerIndices);
            return currentIndex;
        },
    }), [hideContainer, showContainer, visibleContainerIndices]);

    useEffect(() => {
        return cancel;
    }, [cancel]);

    return (
        <div
            className="mde-tab__content"
            ref={containerRef}
            {...props}
        >
            {containers.map((container, idx) => (
                <div
                    className={StringUtil.combinedClassName(
                        "mde-tab__content--item",
                        visibleContainerIndices.has(idx) ? undefined : "hidden"
                    )}
                    key={idx}
                >
                    {visibleContainerIndices.has(idx) ? container : null}
                </div>
            ))}
        </div>
    );
});

export default MdeTabContent;