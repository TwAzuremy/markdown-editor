// noinspection ES6PreferShortImport
import {IpcHandler, IpcSender} from "../../types/ipc.ts";
// noinspection ES6PreferShortImport
import {IpcRegistry} from "../../abstract/IpcRegistry.ts";
import {LoggerHandlers} from "../handlers/logger.ts";

export class LoggerRegistry extends IpcRegistry {
    private handlers: IpcHandler[] = [];
    private senders: IpcSender[] = [];

    constructor(private loggerHanders: LoggerHandlers) {
        super();
        this.initializeHandlers();
    }

    private initializeHandlers(): void {
        this.handlers = [
            this.loggerHanders.infoHandler(),
            this.loggerHanders.warnHandler(),
            this.loggerHanders.errorHandler(),
            this.loggerHanders.debugHandler(),
            this.loggerHanders.verboseHandler()
        ];
    }

    public getHandlers(): IpcHandler[] {
        return this.handlers;
    }

    public getSenders(): IpcSender[] {
        return this.senders;
    }
}