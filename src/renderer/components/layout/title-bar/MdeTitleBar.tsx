import MdeButton from "@ui/button/MdeButton.tsx";
import MdeIcon from "@ui/icon/MdeIcon.tsx";
import {ReactElement, useEffect, useRef, useState} from "react";
import {WINDOW_CHANNELS} from "@/ipc/channels/window.ts";
import {useI18n} from "@renderer/hook/useI18n.ts";

import "./mde-title-bar.scss";

function MdeTitleBar(): ReactElement {
    const {t} = useI18n();

    const [isMaximized, setIsMaximized] = useState(false);
    const maximizeSvgRef = useRef<SVGSVGElement>(null);

    /**
     * Updates the SVG path and the visual state of the maximize button based on the window's
     * maximized state. It morphs between the "maximized" and "windowing" SVG paths.
     *
     * @param {boolean} isMaximized - Indicates whether the window is maximized.
     *                                True if maximized, false otherwise.
     */
    function morph(isMaximized: boolean): void {
        const svg = maximizeSvgRef.current as SVGSVGElement;
        if (!svg) return;

        // Set the SVG path depending on whether the window is maximized or not.
        const morphPath = svg.dataset[isMaximized ? 'maximized' : 'windowing'];
        svg.getElementById('maximize-icon__rect').setAttribute('d', morphPath as string);

        // Apply a CSS class to control the transition of the path, specifically for "windowing" state.
        svg.classList.toggle('svg__state--windowing', !isMaximized);

        // Ensure the React state update happens after the transition/animation is complete.
        requestAnimationFrame(() => setIsMaximized(isMaximized));
    }

    /**
     * Queries the current window state to check whether it is maximized.
     *
     * @returns {Promise<boolean>} - A promise that resolves to true if the window is maximized,
     * false otherwise.
     */
    async function checkMaximized(): Promise<boolean> {
        const data = await window.ipcRenderer.query(WINDOW_CHANNELS.GET_STATE) as { isMaximized: boolean; };

        return data.isMaximized || false;
    }

    /**
     * Minimizes the window by sending a command to the renderer process.
     */
    function windowMinimize(): void {
        window.ipcRenderer.command(WINDOW_CHANNELS.MINIMIZE);
    }

    /**
     * Maximizes the window by sending a command to the renderer process.
     */
    function windowMaximize(): void {
        window.ipcRenderer.command(WINDOW_CHANNELS.MAXIMIZE);
    }

    /**
     * Closes the window by sending a command to the renderer process.
     */
    function windowClose(): void {
        window.ipcRenderer.command(WINDOW_CHANNELS.CLOSE);
    }

    useEffect(() => {
        // Listen for window maximize state change events.
        window.ipcRenderer.on(WINDOW_CHANNELS.ON_MAXIMIZE,
            (_, isMaximized: boolean) => morph(isMaximized));

        // Check and set the initial window maximized state.
        (async () => {
            const isMaximized = await checkMaximized();
            setIsMaximized(isMaximized);
        })();

        return () => {
            // Cleanup the event listener when the component is unmounted.
            window.ipcRenderer.off(WINDOW_CHANNELS.ON_MAXIMIZE,
                (_, isMaximized: boolean) => morph(isMaximized));
        };
    }, []);

    // TODO [Reserved] Divide the draggable object into two parts and insert an input box in the middle.
    //  The width of the first draggable element is equal to `(100vh - input box width (declared using a CSS variable)) / 2`,
    //  minus the sidebar width (declared using a CSS variable).
    return (
        <div className={"app__title-bar"}>
            {/* Control the dragging of the window. */}
            <div className={"app__window-drag"}></div>
            <div className={"app__window-controller"}>
                <MdeButton
                    icon={<MdeIcon name={'minimize'} className={'app__minimize'}/>}
                    title={t('title-bar.window-controller.minimize')}
                    onClick={windowMinimize}
                />
                {/* The function of `OnRender()` is to refresh the SVG path when the icon is initialized. */}
                <MdeButton
                    icon={<MdeIcon
                        className={'app__maximize' + (isMaximized ? '' : ' svg__state--windowing')}
                        name={'maximize'}
                        ref={maximizeSvgRef}
                        onRender={() => morph(isMaximized)}
                    />}
                    title={t(isMaximized ? 'title-bar.window-controller.unmaximize' :
                        'title-bar.window-controller.maximize')}
                    onClick={windowMaximize}
                />
                <MdeButton
                    icon={<MdeIcon name={'close'} className={'app__close'}/>}
                    title={t('title-bar.window-controller.close')}
                    onClick={windowClose}
                />
            </div>
        </div>
    );
}

export default MdeTitleBar;