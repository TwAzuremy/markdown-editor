import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@styles/index.scss';
import {initI18n} from '@/i18n/main.ts';
import {initRendererLog} from "@utils/IpcLogUtil.ts";

import {scan} from "react-scan";
// Configure react-scan.
scan({
    enabled: true,
    log: false,
    showToolbar: true
});

// noinspection JSIgnoredPromiseFromCall
initI18n();

// Initialize log output for the rendering layer.
const logger = initRendererLog();
logger.info('Page loading...');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
