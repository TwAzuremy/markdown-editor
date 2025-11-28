# IPC Registration Documents

## Overview

This project uses the decorator pattern to implement an automatic registration mechanism for Electron IPC (Inter-Process Communication). By using custom decorators, the creation and management of IPC channels can be simplified.

## Core Document Description

- `ipc.decorator.ts` - IPC Decorator Implementation
- `ipc.type.ts` - IPC Type Definition
- `.service.ts` - IPC Service Class Example

## Registration Process

### Create IPC service class

Create a new IPC service class in the `src/services/` directory:

```typescript
// tutorial.service.ts
import { IpcOn, IpcHandle, RegisterIpcHandlers } from "../decorators/ipc.decorator.ts";
import type { IpcMainEvent } from 'electron';
import { IPC_CHANNELS } from "../constants/ipc.enum.ts";

/**
 * Use @RegisterIpcHandlers to automatically register all IPC handlers
 */
@RegisterIpcHandlers
export class TutorialHandlers {
    /**
     * Use the @IpcOn decorator to register an event listener 
     * for the 'tutorial:message' channel
     */
    @IpcOn('tutorial:message')
    public handleTutorialMessage(event: IpcMainEvent, message: string): void {
        console.log('Received message:', message);
        // Handle business logic
    }

    /**
     * Use the @IpcHandle decorator to register a handler that 
     * can return a value to handle invocation requests on 
     * the 'tutorial:add' channel
     */
    @IpcHandle('tutorial:add')
    public handleTutorialAdd(event: IpcMainEvent, a: number, b: number): number {
        return a + b;
    }

    /**
     * Use the @IpcOnce decorator to register a one-time event listener
     * Triggered only the first time a message is received
     */
    @IpcOnce('tutorial:init')
    public handleTutorialInit(): void {
        console.log('Tutorial initialized');
    }
}
```

### Initialize the service in `main.ts`

Instantiate the service class in the entry file of the Electron main process (usually `main.ts`):

```typescript
function initializeIpc() {
    new WindowHandlers(win);
    new TutorialHandlers(); // <- Here
}
```

## Detailed Explanation of Decorators

### @RegisterIpcHandlers

A class decorator used to automatically register all methods in a class that are marked with the IPC decorator.

#### Function

- Automatically scan all IPC handler methods when the class is instantiated
- Automatically register to `ipcMain` based on the operation type
- Provide error checking and logging

### @Ipc

Basic method decorator, accepts a configuration object:

```typescript
@Ipc({ 
    channel: 'custom:channel', 
    operation: IPC_MAIN_OPERATION.ON 
})
public customHandler(event: IpcMainEvent, data: any): void {
    // Handle business logic
}
```

#### Derivative Decorator

##### @IpcOn

Register a persistent listener, corresponding to `ipcMain.on`

```typescript
@IpcOn('custom:channel')
public customHandler(event: IpcMainEvent, data: any): void {
    // Handle business logic
}
```

##### @IpcOnce

Register a one-time listener, corresponding to `ipcMain.once`

```typescript
@IpcOnce('custom:channel')
public customHandler(event: IpcMainEvent, data: any): void {
    // Handle business logic
}
```

##### @IpcHandle

Registers a handler that can return a value, corresponding to `ipcMain.handle`

```typescript
@IpcHandle('custom:channel')
public customHandler(event: IpcMainEvent, data: any): string {
    // Handle business logic
    
    return 'hello'
}
```

## Precautions

1. Decorator order: `@RegisterIpcHandlers` must be used at the class level
2. Method Binding: All IPC handler methods are automatically bound to the class instance
