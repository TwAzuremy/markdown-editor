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
 * Defines the expected properties for the `MdeIcon` component.
 *
 * @property {string} name - The name of the SVG icon file to render.
 * @property {componentSize} [size] - Defines the size of the icon. Can be `'small'`, `'medium'`, or `'large'`.
 * @property {function} [onRender] - A callback function that is called when the icon has been rendered.
 */
interface MdeIconProps extends SVGProps<SVGSVGElement> {
    name: string;
    size?: componentSize;
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
 * It utilizes React's `lazy` and `Suspense` to load the icons asynchronously, improving performance.
 * The global cache (`ICON_CACHE`) is used to prevent reloading the same icon multiple times.
 *
 * @param {string} name - The name of the icon to render. This corresponds to the SVG file's name in the assets folder.
 * @param {string} [size='medium'] - The size of the icon. Can be one of the following:
 * - `'small'`: Renders the icon in a smaller size.
 * - `'medium'`: The default size for the icon.
 * - `'large'`: Renders the icon in a larger size.
 *
 * The `size` prop determines the CSS class that will be applied to style the icon's dimensions.
 *
 * @param {function} [onRender] - A callback function invoked when the icon has been rendered.
 * @param {React.Ref} [ref] - A reference to the rendered SVG element.
 *
 * @returns {React.FC} - A `Suspense`-wrapped icon component that lazily loads the specified SVG icon.
 *
 * @example
 * <MdeIcon name="left" size="small" />
 */
const MdeIcon: React.FC<MdeIconProps> =
    memo(forwardRef((
        {name, size = 'medium', className, onRender, ...props},
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
                />
            </Suspense>
        );
    }));

export default MdeIcon;
