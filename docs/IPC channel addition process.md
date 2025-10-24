# How to add a new IPC channel

## 1. Add IPC channel name and function

Create a new `<channel-name>.ts` file in the **channels **and **handlers folders**.

Write the channel names to be used in the `<channel-name>.ts` file under the **channels folder**.

```typescript
export const CHANNEL_CHANNELS = {
    MESSAGE: 'channel-message'
} as const;
```

Write the channel classes to be used in the `<channel-name>.ts` file under the **handlers folder**.

```typescript
export class ChannelHandler {
    constructor() {
    }

    public MessageHandler(): IpcHandler {
        return {
            channel: CHANNEL_CHANNELS.MESSAGE,
            operation: 'handle',
            handler: (
                event, ...args
            ): IpcChannelMap[typeof CHANNEL_CHANNELS.MESSAGE]['return'] => {
                const [message] = args;

                return `Hello, ${message}`;
            }
        };
    }
}
```

## 2. Set the channel type

Add your channel name in `IpcChannelMap.ts`, and set the types for the parameters and return value.

For different types of channels, here are *4 preset channel types*:

- `IpcCommand`: No parameters, no return value.

- `IpcQuery<T>`: No parameters, return value.

- `IpcExecuteWithArgs<Args extends unknown[] = []>`: Parameters, return value.

- `IpcFetchWithArgs<Args extends unknown[] = [], T = void>`: Has parameters and return value (none by default).

Annotate your channel types in `IpcChannelMap.ts`:

```typescript
export interface IpcChannelMap {
    [CHANNEL_CHANNELS.MESSAGE]: IpcFetchWithArgs<[string], string>;
}
```

## 3. Add IPC channel registrar

Create a new `<channel-name>.ts` file in the **registries folder**.

Inherit the `IpcRegistry` class, which provides basic `registration` and `unregistration` methods. This applies to most situations, but of course, you can override them.

Now you just need to put all your channels into `handlers`.

```typescript
export class ChannelRegistry extends IpcRegistry {
    private handlers: IpcHandler[] = [];
    private senders: IpcHandler[] = [];

    constructor(private channelHanders: ChannelHandler) {
        super();
        
        this.handlers = [
            // Add your handlers here.
            this.channelHanders.messageHandler()
        ]
    }

    public getHandlers(): IpcHandler[] {
        return this.handlers;
    }

    public getSenders(): IpcSender[] {
        return this.senders;
    }
}
```

## 4. Registration Channel

In electron's `main.ts`, find the `initializeIpc` function. Create an instance and add it to `ipcManager`.

```typescript
function initializeIpc() {
    // Create a handler instance
    const channelHandlers = new ChannelHandler();
    // Create a registrar
    const channelRegistry = new ChannelRegistry(channelHandlers);

    // Add to manager
    ipcManager.addRegistry(channelRegistry);

    // Register all IPC
    ipcManager.registerAll();
}
```

Finally, in your renderer layer, use `window.ipcRenderer` to call the channel. (Of course, you can use your custom API key)

```typescript
window.ipcRenderer.invoke(CHANNEL_CHANNELS.MESSAGE).then((response) => {
    console.log(response);
});
```