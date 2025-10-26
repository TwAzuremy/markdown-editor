import './mde-flex-blank.scss';

/**
 * `MdeFlexBlank` is a React component used to create an empty flex container.
 * It is primarily used for expanding elements within a Flex layout without rendering any content.
 * This component accepts custom `className` and other props that can be passed to the `<div>` element.
 *
 * @returns {React.ReactElement<HTMLDivElement>} A `div` element with flex properties.
 *
 * @example
 * <MdeFlexBlank />
 */
function MdeFlexBlank({...props}): React.ReactElement<HTMLDivElement> {
    return (
        // Only used to expand elements within a Flex layout
        <div className={"mde-blank--flex"} {...props}></div>
    );
}

export default MdeFlexBlank;