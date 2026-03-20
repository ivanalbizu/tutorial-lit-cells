import { ReactiveController, ReactiveControllerHost } from 'lit';
import { publish, subscribe, unsubscribe } from '@open-cells/core';

const CHANNEL = 'wishlist-items';
let _ids: Set<string> = new Set();

export class WishlistController implements ReactiveController {
  host: ReactiveControllerHost;

  get items(): Set<string> {
    return _ids;
  }

  get count(): number {
    return _ids.size;
  }

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    subscribe(CHANNEL, this.host, (ids: string[]) => {
      _ids = new Set(ids);
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    unsubscribe(CHANNEL, this.host);
  }

  has(id: string): boolean {
    return _ids.has(id);
  }

  toggle(id: string) {
    if (_ids.has(id)) {
      _ids.delete(id);
    } else {
      _ids.add(id);
    }
    publish(CHANNEL, [..._ids]);
  }
}
