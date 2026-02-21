import { LitElement, html, css, nothing } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { PageController } from '@open-cells/page-controller';
import { CartController } from '../../controllers/cart-controller.js';
import '../../components/page-layout.js';

// ═══════════════════════════════════════════════════════════════
// PÁGINA CARRITO — Proyecto final
//
// Integra:
//   - CartController (Reactive Controller) — estado centralizado
//   - repeat() (rama 08) — lista con keys para reordenamiento
//   - when() (rama 08) — condicional carrito vacío/lleno
//   - @query (rama 11) — acceso directo al DOM
//   - page-layout con slots (rama 09) — composición
//   - PageController (rama 13) — navegación
// ═══════════════════════════════════════════════════════════════

@customElement('cart-page')
export class CartPage extends LitElement {
  pageController = new PageController(this);
  cart = new CartController(this);

  // @query — acceso declarativo al DOM (rama 11)
  @query('#cart-list')
  private _cartList!: HTMLElement;

  static styles = css`
    :host { display: block; }

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

    .item-info p { color: #888; margin: 0; font-size: 0.85rem; }

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
    button.primary { padding: 0.5rem 1rem; }

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

    .actions-bar {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .scroll-hint {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #555;
    }
  `;

  private _scrollToTop() {
    // Ejemplo de @query — acceso directo al DOM sin querySelector
    this._cartList?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    return html`
      <page-layout pageTitle="Carrito">
        <span slot="subtitle">
          ${this.cart.count} artículo${this.cart.count !== 1 ? 's' : ''}
        </span>

        ${when(
          this.cart.isEmpty,
          () => this._renderEmpty(),
          () => this._renderCart()
        )}

        <div slot="footer">
          <p style="color: #555; font-size: 0.8rem;">
            CartController: Reactive Controller + Channels pub/sub
          </p>
        </div>
      </page-layout>
    `;
  }

  private _renderEmpty() {
    return html`
      <div class="empty">
        <p>El carrito está vacío</p>
        <button class="primary" style="margin-top: 1rem;"
          @click=${() => this.pageController.navigate('home')}>
          Ir a comprar
        </button>
      </div>
    `;
  }

  private _renderCart() {
    return html`
      <div id="cart-list">
        ${repeat(
          this.cart.items,
          item => item.id,
          item => html`
            <div class="cart-item">
              <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.price.toFixed(2)} &euro; c/u</p>
              </div>
              <div class="item-actions">
                <button @click=${() => this.cart.updateQuantity(item.id, -1)}>-</button>
                <span class="quantity">${item.quantity}</span>
                <button @click=${() => this.cart.updateQuantity(item.id, 1)}>+</button>
                <button class="danger" @click=${() => this.cart.remove(item.id)}>
                  Quitar
                </button>
              </div>
            </div>
          `
        )}
      </div>

      <div class="total">
        <span>Total</span>
        <span class="price">${this.cart.total.toFixed(2)} &euro;</span>
      </div>

      <div class="actions-bar">
        <button class="danger" @click=${() => this.cart.clear()}>Vaciar</button>
        <button class="primary"
          @click=${() => this.pageController.navigate('home')}>
          Seguir comprando
        </button>
      </div>
    `;
  }
}
