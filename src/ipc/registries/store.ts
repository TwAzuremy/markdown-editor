// noinspection ES6PreferShortImport
import {IpcHandler, IpcSender} from "../../types/ipc.ts";
// noinspection ES6PreferShortImport
import {IpcRegistry} from "../../abstract/IpcRegistry.ts";
import {StoreHandlers} from "../handlers/store.ts";

export class StoreRegistry extends IpcRegistry {
    private handlers: IpcHandler[] = [];
    private senders: IpcSender[] = [];

    constructor(private storeHandlers: StoreHandlers) {
        super();
        this.initializeHandlers();
    }

    /**
     * Initializes all IPC handlers for the resource.
     */
    private initializeHandlers(): void {
        // Collect all processors
        this.handlers = [
            this.storeHandlers.getHandler(),
            this.storeHandlers.setHandler(),
            this.storeHandlers.deleteHandler(),
            this.storeHandlers.resetHandler()
        ];
    }

    public getHandlers(): IpcHandler[] {
        return this.handlers;
    }

    public getSenders(): IpcSender[] {
        return this.senders;
    }
}