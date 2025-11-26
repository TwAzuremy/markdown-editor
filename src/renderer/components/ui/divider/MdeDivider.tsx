import {ReactElement} from "react";
import {StringUtil} from "@utils/StringUtil.ts";

import './mde-divider.scss';

/**
 * Direction options for MdeDivider.
 * - 'horizontal': Divider is displayed horizontally.
 * - 'vertical': Divider is displayed vertically.
 */
type MdeDividerDirection = "horizontal" | "vertical";
/**
 * Contrast options for MdeDivider.
 * - 'default': Divider has default contrast.
 * - 'strong': Divider has stronger contrast, making it more prominent.
 */
type MdeDividerContrast = "default" | "strong";

/**
 * Properties that MdeDivider component accepts.
 */
type MdeDividerProps = {
    direction?: MdeDividerDirection;
    contrast?: MdeDividerContrast;
} & React.HTMLAttributes<HTMLHRElement>;

/**
 * MdeDivider component renders a customizable horizontal or vertical divider with varying contrast.
 * It extends the functionality of a standard `<hr>` element, allowing for additional styling and customization.
 *
 * @param [direction="horizontal"] - Specifies the direction of the divider.
 *    - "horizontal" (default): The divider will be displayed horizontally.
 *    - "vertical": The divider will be displayed vertically.
 *
 * @param [contrast="default"] - Specifies the contrast level of the divider.
 *    - "default" (default): The divider will have the default contrast.
 *    - "strong": The divider will have a stronger contrast, making it more prominent.
 *
 * @param props - Additional HTML attributes that can be applied to the `<hr>` element.
 *
 * @returns {JSX.Element} A styled `<hr>` element with a customized direction and contrast.
 *
 * @example
 * <MdeDivider />
 */
function MdeDivider({
                        direction = "horizontal",
                        contrast = "default",
                        ...props
                    }: MdeDividerProps): ReactElement<MdeDividerProps> {
    return (
        <hr
            className={
                StringUtil.combinedClassName(
                    "mde-divider",
                    `mde-divider__contrast--${contrast}`,
                    `mde-divider__direction--${direction}`
                )
            }
            {...props}
        />
    );
}

export default MdeDivider;