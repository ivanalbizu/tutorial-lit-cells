import { ReactiveController, ReactiveControllerHost } from 'lit';
import { publish, subscribe, unsubscribe } from '@open-cells/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CHANNEL = 'cart-items';

let _sharedItems: CartItem[] = [];

export class CartController implements ReactiveController {
  host: ReactiveControllerHost;

  get items(): CartItem[] {
    return _sharedItems;
  }

  get total(): number {
    return _sharedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  get count(): number {
    return _sharedItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  get isEmpty(): boolean {
    return _sharedItems.length === 0;
  }

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    subscribe(CHANNEL, this.host, (items: CartItem[]) => {
      _sharedItems = items;
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    unsubscribe(CHANNEL, this.host);
  }

  add(product: { id: string; name: string; price: number; image: string }) {
    const existing = _sharedItems.find(i => i.id === product.id);
    const updated = existing
      ? _sharedItems.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      : [..._sharedItems, { ...product, quantity: 1 }];
    publish(CHANNEL, updated);
  }

  remove(id: string) {
    publish(CHANNEL, _sharedItems.filter(i => i.id !== id));
  }

  updateQuantity(id: string, delta: number) {
    const updated = _sharedItems
      .map(i =>
        i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
      )
      .filter(i => i.quantity > 0);
    publish(CHANNEL, updated);
  }

  clear() {
    publish(CHANNEL, []);
  }
}
