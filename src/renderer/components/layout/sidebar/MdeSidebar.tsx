import {ReactElement} from "react";
import {StringUtil} from "@utils/StringUtil.ts";
import LOGO from "@assets/img/logo.png";

import './mde-sidebar.scss';

function MdeSidebar(): ReactElement<HTMLElement> {
    const APP_NAME = import.meta.env.VITE_APP_PRODUCT_NAME ||
        import.meta.env.VITE_APP_NAME || 'Markdown Editor';

    return (
        <aside className={"app__sidebar"}>
            <header className={"sidebar__header"}>
                <img src={LOGO} alt="LOGO" className={'app__logo'} draggable={false}/>
                <h4 className={"app__name"}>{StringUtil.formatStringToTitleCase(APP_NAME)}</h4>
            </header>
            <main className={"sidebar__container"}></main>
            <footer className={"sidebar__footer"}></footer>
        </aside>
    );
}

export default MdeSidebar;