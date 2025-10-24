import {ipcRenderer, contextBridge} from 'electron';
import {LOG_MODULE_NAME} from "../constants/log.enum.ts";
import {LOGGER_CHANNELS} from "../ipc/channels/logger.ts";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args;
        return ipcRenderer.off(channel, ...omit);
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        ipcRenderer.send(channel, ...omit);
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
    },

    // You can expose other APTs you need here.
    // ...

    command(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel] = args;
        ipcRenderer.send(channel);
    },
    query(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel] = args;
        return ipcRenderer.invoke(channel);
    },
    execute(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        ipcRenderer.send(channel, ...omit);
    },
    fetch(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
    },
});

contextBridge.exposeInMainWorld('logger', {
    info(...args: Parameters<LoggerHandler>) {
        const [module, ...omit] = args;
        ipcRenderer.send(LOGGER_CHANNELS.INFO, module || LOG_MODULE_NAME.RENDERER, ...omit);
    },
    warn(...args: Parameters<LoggerHandler>) {
        const [module, ...omit] = args;
        ipcRenderer.send(LOGGER_CHANNELS.WARN, module || LOG_MODULE_NAME.RENDERER, ...omit);
    },
    error(...args: Parameters<LoggerHandler>) {
        const [module, ...omit] = args;
        ipcRenderer.send(LOGGER_CHANNELS.ERROR, module || LOG_MODULE_NAME.RENDERER, ...omit);
    },
    debug(...args: Parameters<LoggerHandler>) {
        const [module, ...omit] = args;
        ipcRenderer.send(LOGGER_CHANNELS.DEBUG, module || LOG_MODULE_NAME.RENDERER, ...omit);
    },
    verbose(...args: Parameters<LoggerHandler>) {
        const [module, ...omit] = args;
        ipcRenderer.send(LOGGER_CHANNELS.VERBOSE, module || LOG_MODULE_NAME.RENDERER, ...omit);
    },
});
