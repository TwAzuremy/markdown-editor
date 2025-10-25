import MdeSidebar from "@layout/sidebar/MdeSidebar.tsx";
import MdeTitleBar from "@layout/title-bar/MdeTitleBar.tsx";
import MdeContent from "@layout/content/MdeContent.tsx";
import MdeFooter from "@layout/footer/MdeFooter.tsx";

import '@styles/App.scss';

function App() {
    return (
        <div className="app">
            <MdeSidebar />
            <MdeTitleBar />
            <MdeContent />
            <MdeFooter />
        </div>
    );
}

export default App;
