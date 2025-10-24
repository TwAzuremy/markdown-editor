// noinspection ES6PreferShortImport
import {IpcHandler, IpcSender} from "../../types/ipc.ts";
// noinspection ES6PreferShortImport
import {IpcRegistry} from "../../abstract/IpcRegistry.ts";
import {WindowHandlers} from "../handlers/window.ts";

export class WindowRegistry extends IpcRegistry {
    private handlers: IpcHandler[] = [];
    private senders: IpcSender[] = [];

    constructor(private windowHandlers: WindowHandlers) {
        super();
        this.initializeHandlers();
    }

    /**
     * Initializes all IPC handlers for the window.
     */
    private initializeHandlers(): void {
        // Collect all processors
        this.handlers = [
            this.windowHandlers.minimizeHandler(),
            this.windowHandlers.maximizeHandler(),
            this.windowHandlers.closeHandler(),
            this.windowHandlers.getStateHandler()
        ];
    }

    public getHandlers(): IpcHandler[] {
        return this.handlers;
    }

    public getSenders(): IpcSender[] {
        return this.senders;
    }
}