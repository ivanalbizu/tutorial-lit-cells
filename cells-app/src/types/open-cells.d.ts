declare module '@open-cells/core' {
  export function startApp(config: {
    routes: unknown[];
    mainNode: string;
    interceptor?: (navigation: unknown, ctx: unknown) => unknown;
    viewLimit?: number;
    persistentPages?: string[];
  }): void;
  export function navigate(page: string, params?: Record<string, string>): void;
  export function publish(channel: string, data: unknown, options?: object): void;
  export function subscribe(channel: string, node: object, callback: (data: any) => void): void;
  export function unsubscribe(channel: string | string[], node: object): void;
}

declare module '@open-cells/page-controller' {
  import { ReactiveController, ReactiveControllerHost } from 'lit';
  export class PageController implements ReactiveController {
    constructor(host: ReactiveControllerHost);
    hostConnected(): void;
    hostDisconnected(): void;
  }
}

declare module '@open-cells/element-controller' {
  import { ReactiveController, ReactiveControllerHost } from 'lit';
  export class ElementController implements ReactiveController {
    constructor(host: ReactiveControllerHost);
    hostConnected(): void;
    hostDisconnected(): void;
  }
}
