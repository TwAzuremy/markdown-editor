// noinspection ES6PreferShortImport
import {IpcHandler, IpcSender} from "../../types/ipc.ts";
// noinspection ES6PreferShortImport
import {IpcRegistry} from "../../abstract/IpcRegistry.ts";
import {ResourceHandlers} from "../handlers/resource.ts";

export class ResourceRegistry extends IpcRegistry {
    private handlers: IpcHandler[] = [];
    private senders: IpcSender[] = [];

    constructor(private resourceHandlers: ResourceHandlers) {
        super();
        this.initializeHandlers();
    }

    /**
     * Initializes all IPC handlers for the resource.
     */
    private initializeHandlers(): void {
        // Collect all processors
        this.handlers = [
            this.resourceHandlers.getResourcePath(),
            this.resourceHandlers.getLanguageMap(),
            this.resourceHandlers.readJson()
        ];
    }

    public getHandlers(): IpcHandler[] {
        return this.handlers;
    }

    public getSenders(): IpcSender[] {
        return this.senders;
    }
}