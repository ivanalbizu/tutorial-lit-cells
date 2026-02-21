import { ReactiveController, ReactiveControllerHost } from 'lit';
import { publish, subscribe, unsubscribe } from '@open-cells/core';

// ═══════════════════════════════════════════════════════════════
// REACTIVE CONTROLLER — Carrito de compras
//
// Centraliza la lógica del carrito en un controller reutilizable.
// Combina dos conceptos del tutorial:
//   - Reactive Controllers (rama 10)
//   - Channels pub/sub de Open Cells (rama 15)
//
// Cualquier componente puede instanciarlo:
//   cart = new CartController(this);
//
// Y acceder al estado y las acciones:
//   this.cart.items, this.cart.total
//   this.cart.add(product), this.cart.remove(id)
//
// El controller se suscribe/desuscribe automáticamente
// usando el lifecycle de Lit (hostConnected/hostDisconnected).
//
// Comparación:
//   React:   useCart() custom hook
//   Angular: CartService inyectable
//   Vue:     useCart() composable
//   Stencil: No tiene equivalente (usarías un store manual)
// ═══════════════════════════════════════════════════════════════

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CHANNEL = 'ch-cart';

export class CartController implements ReactiveController {
  host: ReactiveControllerHost;
  items: CartItem[] = [];

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get count(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    subscribe(CHANNEL, (items: CartItem[]) => {
      this.items = [...items];
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    unsubscribe(CHANNEL);
  }

  add(product: { id: string; name: string; price: number }) {
    const existing = this.items.find(item => item.id === product.id);
    let updated: CartItem[];

    if (existing) {
      updated = this.items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...this.items, { ...product, quantity: 1 }];
    }

    publish(CHANNEL, updated);
  }

  remove(id: string) {
    publish(CHANNEL, this.items.filter(item => item.id !== id));
  }

  updateQuantity(id: string, delta: number) {
    const updated = this.items
      .map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter(item => item.quantity > 0);

    publish(CHANNEL, updated);
  }

  clear() {
    publish(CHANNEL, []);
  }
}
