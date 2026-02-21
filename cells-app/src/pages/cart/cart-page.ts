import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';

// ═══════════════════════════════════════════════════════════════
// PÁGINA CARRITO — Recibe estado via channels (pub/sub)
//
// Open Cells usa un sistema de "channels" para compartir
// estado entre páginas y componentes de forma desacoplada.
//
// subscribe(channel, callback) — Escuchar un canal
// unsubscribe(channel)        — Dejar de escuchar
// publish(channel, data)      — Publicar datos en un canal
//
// Los channels son globales: cualquier componente puede
// publicar y cualquier otro puede suscribirse.
//
// Comparación:
//   Stencil:  Stencil Store o eventos custom en window
//   React:    Context API, Redux, Zustand
//   Angular:  Services con BehaviorSubject (RxJS)
//   Vue:      Pinia, Vuex, provide/inject
// ═══════════════════════════════════════════════════════════════

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@customElement('cart-page')
export class CartPage extends LitElement {
  pageController = new PageController(this);

  @state()
  private _items: CartItem[] = [];

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 { color: #646cff; margin-bottom: 0.5rem; }
    .subtitle { color: #888; margin-bottom: 1.5rem; }

    .empty {
      padding: 2rem;
      text-align: center;
      color: #666;
      background: #2a2a3e;
      border-radius: 8px;
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #2a2a3e;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      border: 1px solid #333;
    }

    .item-info h3 {
      color: #c4c4ff;
      margin: 0 0 0.25rem;
      font-size: 1rem;
    }

    .item-info p {
      color: #888;
      margin: 0;
      font-size: 0.85rem;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quantity {
      font-size: 1.1rem;
      font-weight: bold;
      min-width: 2rem;
      text-align: center;
    }

    button {
      padding: 0.3rem 0.6rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
      font-size: 0.85rem;
    }

    button:hover { background: #535bf2; }
    button.danger { background: #f44336; }
    button.danger:hover { background: #d32f2f; }

    .total {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      background: #1a3a1a;
      border: 1px solid #2a5a2a;
      border-radius: 8px;
      margin-top: 1rem;
      font-size: 1.1rem;
    }

    .total .price { color: #4caf50; font-weight: bold; }

    .channel-info {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #1a1a2e;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.8rem;
      color: #666;
    }

    .channel-info code { color: #4caf50; }

    .actions-bar {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  `;

  onPageEnter() {
    // Suscribirse al canal del carrito
    this.pageController.subscribe('ch-cart', (items: CartItem[]) => {
      this._items = [...items];
    });
  }

  onPageLeave() {
    this.pageController.unsubscribe('ch-cart');
  }

  private _removeItem(id: string) {
    const updated = this._items.filter(item => item.id !== id);
    // Publicar el cambio para que todos los suscriptores se actualicen
    this.pageController.publish('ch-cart', updated);
  }

  private _clearCart() {
    this.pageController.publish('ch-cart', []);
  }

  private _updateQuantity(id: string, delta: number) {
    const updated = this._items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0);
    this.pageController.publish('ch-cart', updated);
  }

  render() {
    const total = this._items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return html`
      <h1>Carrito</h1>
      <p class="subtitle">Estado compartido via channels (pub/sub)</p>

      ${this._items.length === 0
        ? html`
          <div class="empty">
            <p>El carrito está vacío</p>
            <p style="font-size: 0.85rem; margin-top: 0.5rem;">
              Ve a Home → Productos para añadir items
            </p>
            <button style="margin-top: 1rem;"
              @click=${() => this.pageController.navigate('home')}>
              Ir a Home
            </button>
          </div>
        `
        : html`
          ${this._items.map(item => html`
            <div class="cart-item">
              <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.price.toFixed(2)} &euro; c/u</p>
              </div>
              <div class="item-actions">
                <button @click=${() => this._updateQuantity(item.id, -1)}>-</button>
                <span class="quantity">${item.quantity}</span>
                <button @click=${() => this._updateQuantity(item.id, 1)}>+</button>
                <button class="danger" @click=${() => this._removeItem(item.id)}>
                  Quitar
                </button>
              </div>
            </div>
          `)}

          <div class="total">
            <span>Total</span>
            <span class="price">${total.toFixed(2)} &euro;</span>
          </div>

          <div class="actions-bar">
            <button class="danger" @click=${this._clearCart}>Vaciar carrito</button>
            <button @click=${() => this.pageController.navigate('home')}>
              Seguir comprando
            </button>
          </div>
        `}

      <div class="channel-info">
        <p>Canal: <code>'ch-cart'</code></p>
        <p>Suscripción: <code>pageController.subscribe('ch-cart', cb)</code></p>
        <p>Publicación: <code>pageController.publish('ch-cart', items)</code></p>
        <p>Items actuales: <code>${JSON.stringify(this._items.length)}</code></p>
      </div>
    `;
  }
}
