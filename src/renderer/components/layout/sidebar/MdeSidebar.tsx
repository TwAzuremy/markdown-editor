import {ReactElement} from "react";

import './mde-sidebar.scss';

function MdeSidebar(): ReactElement<HTMLElement> {
    return (
        <aside className={"app__sidebar"}></aside>
    );
}

export default MdeSidebar;