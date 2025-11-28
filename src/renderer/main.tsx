import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@styles/index.scss';
import {initI18n} from '@/i18n/main.ts';
import {LOG_MODULE_NAME} from "@/constants/log.enum.ts";
import {LoggerProxy} from "@/logger/LoggerProxy.ts";

import {scan} from "react-scan";
// Configure react-scan.
scan({
    enabled: true,
    log: false,
    showToolbar: true
});

// noinspection JSIgnoredPromiseFromCall
initI18n();

// Initialize the singleton pattern of LoggerProxy.
const logger = LoggerProxy.getInstance(LOG_MODULE_NAME.RENDERER);
logger.info('Loading page...');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
