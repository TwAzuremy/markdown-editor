import React, {
    lazy,
    memo,
    Suspense,
    useMemo,
    SVGProps,
    forwardRef,
    ForwardedRef,
    useRef,
    useCallback
} from "react";
import {StringUtil} from "@utils/StringUtil.ts";
import {componentSize} from "@/types/component.ts";

import "./mde-icon.scss";

/**
 * `MdeIconProps` Interface
 *
 * Defines the expected properties for the `MdeIcon` component, which renders an SVG icon.
 * The properties include the name of the icon, its size, an optional render callback, and other configuration options.
 *
 * @property {string} name - The name of the SVG icon to render. This should correspond to the icon file.
 * @property {componentSize} [size] - The size of the icon. Can be one of `'small'`, `'medium'`, or `'large'`. If not provided, defaults to a standard size.
 * @property {boolean} [fixedSize] - Forces the icon to maintain a fixed size regardless of any external styling.
 * @property {function} [onRender] - A callback function that is invoked once the icon is rendered. This is useful for triggering actions or events after rendering.
 */
interface MdeIconProps extends SVGProps<SVGSVGElement> {
    name: string;
    size?: componentSize;
    // Used to enforce a fixed icon size
    fixedSize?: boolean;
    onRender?: (...args: unknown[]) => void;
    ref?: ForwardedRef<SVGSVGElement>;
}

/**
 * `LazySvgComponent` Type
 *
 * A type alias for components that are lazily loaded and render SVG elements.
 * The components expect to receive `SVGProps` for rendering SVG files.
 */
type LazySvgComponent = React.LazyExoticComponent<React.FC<SVGProps<SVGSVGElement>>>;

/**
 * `IconCache` Type
 *
 * A type to store loaded SVG components in a cache. The key is the icon name (string),
 * and the value is the corresponding lazy-loaded SVG component (`LazySvgComponent`).
 */
type IconCache = Record<string, LazySvgComponent>;

/**
 * `ICON_CACHE` Constant
 *
 * A global cache object that stores lazily-loaded SVG icon components by name.
 * This avoids redundant imports of the same icon.
 */
const ICON_CACHE: IconCache = {};

/**
 * `MdeIcon` Component
 *
 * A React component that lazily loads SVG icon components based on the provided `name` prop.
 * The icon is asynchronously loaded using React's `lazy` and `Suspense` for improved performance.
 * The component uses a global cache (`ICON_CACHE`) to prevent reloading the same icon multiple times.
 *
 * @param {string} name - The name of the icon to render. This corresponds to the SVG file's name
 * in the assets folder. For example, `name="left"` will load the `left.svg` icon.
 * @param {string} [size='medium'] - The size of the icon. This defines the CSS class to apply for
 * styling the icon's dimensions. Accepted values are:
 * - `'small'`: Renders the icon in a smaller size.
 * - `'medium'`: The default size for the icon.
 * - `'large'`: Renders the icon in a larger size.
 * @param {function} [onRender] - A callback function that is invoked once the icon has been rendered.
 * This can be used for any side effects once the icon is mounted.
 * @param {React.Ref} [ref] - A reference to the rendered SVG element. This allows for external control
 * or access to the DOM node of the icon.
 * @param {boolean} [fixedSize=false] - If `true`, the icon will not be resized based on the surrounding
 * context (e.g., in a responsive layout).
 * @param {string} [className] - Additional class name(s) to apply to the icon component for further
 * customization and styling.
 *
 * @returns {React.FC} - A `Suspense`-wrapped icon component that lazily loads the specified SVG icon.
 * The icon is rendered only when it's successfully loaded from the cache or the assets folder.
 *
 * @example
 * // Renders a small "left" icon
 * <MdeIcon name="left" size="small" />
 */
const MdeIcon: React.FC<MdeIconProps> =
    memo(forwardRef((
        {name, size = 'medium', fixedSize = false, className, onRender, ...props},
        ref) => {
        const internalRef = useRef<SVGSVGElement>(null);

        // Combine the external ref and internal ref
        const combinedRef = useCallback((element: SVGSVGElement | null) => {
            // Handle external ref
            if (typeof ref === 'function') {
                ref(element);
            } else if (ref) {
                ref.current = element;
            }

            // Store in internal ref
            internalRef.current = element;

            // Call onRender callback if provided
            if (element && onRender) {
                onRender?.(element);
            }
        }, [onRender, ref]);

        const Icon: LazySvgComponent = useMemo(() => {
            // Retrieve the icon component from the cache if it exists
            if (ICON_CACHE[name]) {
                return ICON_CACHE[name];
            }

            // If not in the cache, lazily import and store in the cache
            const imported: LazySvgComponent =
                lazy(() => import(`@assets/icons/${name}.svg?react`));

            ICON_CACHE[name] = imported;
            return imported;
        }, [name]);

        return (
            <Suspense fallback={null}>
                <Icon
                    className={StringUtil.combinedClassName(
                        'mde-icon', `mde-icon__size--${size}`, className)}
                    {...props}
                    ref={combinedRef}
                    data-fixed-size={fixedSize}
                />
            </Suspense>
        );
    }));

export default MdeIcon;
