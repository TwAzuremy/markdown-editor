import {ReactElement, useEffect, useRef, useState} from "react";
import {StringUtil} from "@utils/StringUtil.ts";
import LOGO from "@assets/img/logo.png";
import MdeToggleButton from "@ui/button/MdeToggleButton.tsx";
import MdeIcon from "@ui/icon/MdeIcon.tsx";
import {HtmlCssUtil} from "@utils/HtmlCssUtil.ts";
import {StoreUtil} from "@utils/StoreUtil.ts";
import {STORE_KEY} from "@/constants/config.enum.ts";
import {getRendererLog} from "@utils/IpcLogUtil.ts";
import MdeText from "@ui/text/MdeText.tsx";
import MdeFlexBlank from "@ui/blank/MdeFlexBlank.tsx";
import MdeButton from "@ui/button/MdeButton.tsx";
import MdeTab from "@ui/tab/MdeTab.tsx";
import MdeTooltip from "@ui/tooltip/MdeTooltip.tsx";
import MdeDivider from "@ui/divider/MdeDivider.tsx";

import './mde-sidebar.scss';

function MdeSidebar(): ReactElement<HTMLElement> {
    const APP_NAME: string = import.meta.env.VITE_APP_PRODUCT_NAME ||
        import.meta.env.VITE_APP_NAME || 'Markdown Editor';
    const APP_VERSION: string = import.meta.env.VITE_APP_VERSION || '0.0.0';

    const [isDark, setIsDark] = useState<boolean>(false);
    const themeButtonRef = useRef<HTMLLabelElement>(null);

    /**
     * Switches the theme of the website between light and dark mode.
     *
     * This function toggles the theme by modifying the `data-theme` attribute of the `documentElement`
     * (i.e., `<html>` element). It applies a smooth transition effect by animating a circular mask
     * that expands from the center of the theme switch button.
     *
     * @param {boolean} isDark - A boolean flag that indicates whether the theme should be switched to dark mode.
     *   - `true`: Switches to dark mode.
     *   - `false`: Switches to light mode.
     *
     * The function uses the following steps:
     * 1. It determines the center position of the theme switch button (`themeButtonRef.current`).
     * 2. It calculates the maximum distance from the center of the button to any corner of the viewport,
     *    which is used as the radius for the circular transition effect.
     * 3. The transition is performed using `document.startViewTransition` to apply the theme change with an
     *    animated clip-path mask. This transition effect is designed to smoothly transition from a circle
     *    with a radius of 0 to a circle with a radius equal to the maximum distance.
     * 4. The transition duration is configurable via a CSS variable (`--duration-theme-switch`), falling back
     *    to 300ms if the variable is not defined.
     */
    function switchTheme(isDark: boolean): void {
        const element = themeButtonRef.current;
        if (!element) return;

        // Start a view transition to apply theme changes
        const transition = document.startViewTransition(() => {
            document.documentElement.dataset.theme = isDark ? "dark" : "light";
        });

        // Once the transition is ready, calculate the circle radius for the animation
        transition.ready.then(() => {
            const {x, y} = HtmlCssUtil.getElementCenter(element);
            /**
             * Calculate the radius of the circle (AB) for the transition animation.
             *
             * ┌────────────────────────────────┐
             * │      A                         │
             * │      ⨀────────────────────────⨀
             * │      │                         │
             * │      │                         │
             * │      │                         │
             * │      │                         │
             * └──────⨀────────────────────────⨀ B
             */
                // Calculate the distance from the center of the element to the farthest corner of the viewport
            const radius = Math.sqrt(
                    Math.max(x, window.innerWidth - x) ** 2 +
                    Math.max(y, window.innerHeight - y) ** 2
                );

            // Animate the transition using a clip-path effect, expanding from the button's center
            document.documentElement.animate(
                {
                    clipPath: [
                        // Transition from a circle with radius 0 to a circle with the calculated radius
                        `circle(0 at ${x}px ${y}px)`,
                        `circle(${radius}px at ${x}px ${y}px)`,
                    ]
                },
                {
                    // Set the transition duration from a CSS variable or fallback to 300 ms
                    duration: StringUtil.convertToMilliseconds(
                        HtmlCssUtil.getRootVariable('--duration-theme-switch')
                    ) || 300,
                    pseudoElement: "::view-transition-new(root)"
                }
            );
        });
    }

    /**
     * Initializes the theme by retrieving the stored theme preference from local storage or a default value.
     */
    async function initializeTheme(): Promise<string> {
        return await StoreUtil.get(STORE_KEY.THEME, 'auto') as string;
    }

    useEffect(() => {
        initializeTheme().then((response) => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // Determine the final theme based on the response and system preference
            // If the response is 'dark' or 'light', use it; otherwise, use the system preference
            const finalTheme = response === 'dark' ? 'dark'
                : response === 'light' ? 'light'
                    : prefersDark ? 'dark' : 'light';

            // Apply the final theme to the document's data attribute
            document.documentElement.dataset.theme = finalTheme;
            setIsDark(finalTheme === 'dark');
            getRendererLog().info(`Currently used theme: ${finalTheme}`);
        });
    }, []);

    return (
        <aside className={"app__sidebar"}>
            <header className={"sidebar__header"}>
                <img src={LOGO} alt="LOGO" className={'app__logo'} draggable={false}/>
                <h4 className={"app__name"}>{StringUtil.formatStringToTitleCase(APP_NAME)}</h4>
            </header>
            <main className={"sidebar__container"}>
                <MdeTab direction={'horizontal'}>
                    {/* TODO [FEATURES] Explorer */}
                    <MdeText tKey={'sidebar.tab.explorer'} canSelect={false}/>
                    <div>Currently in planning...</div>
                    <MdeText tKey={'sidebar.tab.outline'} canSelect={false}/>
                    <div>Look forward to it...</div>
                </MdeTab>
            </main>
            <MdeDivider />
            <footer className={"sidebar__footer"}>
                <MdeIcon name={'version'} size={'small'} className={'mde-icon__version'}/>
                {/* TODO [FEATURES] Click to go to GitHub. */}
                <MdeText tKey={APP_VERSION} noTranslate/>
                <MdeFlexBlank/>
                <MdeTooltip tip={<MdeText tKey={'sidebar.footer.theme-switch.tooltip'}/>}>
                    <MdeToggleButton
                        size={'small'}
                        icon={<MdeIcon name={'moon'} size={'small'} fixedSize/>}
                        activeIcon={<MdeIcon name={'sun'} size={'small'} fixedSize/>}
                        isActive={isDark}
                        ref={themeButtonRef}
                        onSwitch={switchTheme}
                    />
                </MdeTooltip>
                {/* TODO [SCHEME] Open the settings panel. */}
                <MdeTooltip tip={<MdeText tKey={'sidebar.footer.settings.tooltip'}/>}>
                    <MdeButton
                        size={'small'}
                        variant={'primary'}
                        icon={<MdeIcon name={'settings'} size={'small'}/>}
                    />
                </MdeTooltip>
            </footer>
        </aside>
    );
}

export default MdeSidebar;