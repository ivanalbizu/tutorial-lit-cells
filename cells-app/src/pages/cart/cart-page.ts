import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { PageController } from '@open-cells/page-controller';
import { navigate } from '@open-cells/core';
import { CartController, CartItem } from '../../controllers/cart-controller.js';

@customElement('cart-page')
export class CartPage extends LitElement {
  pageController = new PageController(this);
  cart = new CartController(this);

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      color: #646cff;
      margin-bottom: 1.5rem;
    }

    .empty {
      text-align: center;
      padding: 3rem;
      color: #888;
    }

    .empty h2 {
      margin-bottom: 0.5rem;
      color: #aaa;
    }

    .empty button {
      margin-top: 1rem;
      background: #646cff;
      color: white;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .empty button:hover {
      background: #535bf2;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 80px 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: #16213e;
      border: 1px solid #2a2a4a;
      border-radius: 10px;
      margin-bottom: 0.75rem;
    }

    .cart-item img {
      width: 80px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
    }

    .item-info h3 {
      font-size: 1rem;
      color: #e0e0e0;
      margin-bottom: 0.25rem;
    }

    .item-price {
      color: #4caf50;
      font-weight: 600;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .qty-btn {
      background: #2a2a4a;
      border: none;
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .qty-btn:hover {
      background: #646cff;
    }

    .quantity {
      min-width: 2rem;
      text-align: center;
      font-weight: bold;
    }

    .remove-btn {
      background: none;
      border: none;
      color: #e63946;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0.3rem 0.5rem;
      border-radius: 4px;
      margin-left: 0.5rem;
    }

    .remove-btn:hover {
      background: rgba(230, 57, 70, 0.15);
    }

    .summary {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: #16213e;
      border: 1px solid #2a2a4a;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total {
      font-size: 1.4rem;
      font-weight: bold;
    }

    .total-amount {
      color: #4caf50;
    }

    .summary-actions {
      display: flex;
      gap: 0.75rem;
    }

    .clear-btn {
      background: none;
      border: 1px solid #e63946;
      color: #e63946;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .clear-btn:hover {
      background: rgba(230, 57, 70, 0.15);
    }

    .checkout-btn {
      background: #4caf50;
      border: none;
      color: white;
      padding: 0.6rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .checkout-btn:hover {
      background: #43a047;
    }
  `;

  render() {
    return html`
      <h1>Carrito de compras</h1>

      ${when(this.cart.isEmpty,
        () => html`
          <div class="empty">
            <h2>Tu carrito está vacío</h2>
            <p>Añade productos desde el catálogo</p>
            <button @click=${() => navigate('home')}>Ir al catálogo</button>
          </div>
        `,
        () => this._renderCart()
      )}
    `;
  }

  private _renderCart() {
    return html`
      ${repeat(this.cart.items, (item: CartItem) => item.id, (item: CartItem) => html`
        <div class="cart-item">
          <img src=${item.image} alt=${item.name} />
          <div class="item-info">
            <h3>${item.name}</h3>
            <span class="item-price">${(item.price * item.quantity).toFixed(2)} &euro;</span>
          </div>
          <div class="item-actions">
            <button class="qty-btn" @click=${() => this.cart.updateQuantity(item.id, -1)}>−</button>
            <span class="quantity">${item.quantity}</span>
            <button class="qty-btn" @click=${() => this.cart.updateQuantity(item.id, 1)}>+</button>
            <button class="remove-btn" @click=${() => this.cart.remove(item.id)}>Eliminar</button>
          </div>
        </div>
      `)}

      <div class="summary">
        <div class="total">
          Total: <span class="total-amount">${this.cart.total.toFixed(2)} &euro;</span>
          <br><small style="color: #888">${this.cart.count} artículos</small>
        </div>
        <div class="summary-actions">
          <button class="clear-btn" @click=${() => this.cart.clear()}>Vaciar</button>
          <button class="checkout-btn">Finalizar compra</button>
        </div>
      </div>
    `;
  }
}
