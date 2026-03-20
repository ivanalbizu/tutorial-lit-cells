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
      padding: 2rem 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      color: #646cff;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
    }

    .subtitle {
      color: #888;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }

    /* Estado vacío */
    .empty {
      text-align: center;
      padding: 4rem 2rem;
      color: #888;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      fill: #2a2a4a;
      margin-bottom: 1rem;
    }

    .empty h2 {
      margin-bottom: 0.5rem;
      color: #ccc;
      font-size: 1.3rem;
    }

    .empty p {
      margin-bottom: 1.5rem;
    }

    .cta-btn {
      background: #646cff;
      color: white;
      border: none;
      padding: 0.7rem 1.8rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-family: inherit;
      font-weight: 600;
      transition: background 0.2s;
    }

    .cta-btn:hover {
      background: #535bf2;
    }

    .cta-btn:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }

    /* Items del carrito */
    .cart-list {
      list-style: none;
      padding: 0;
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
      transition: border-color 0.2s;
    }

    .cart-item:hover {
      border-color: #3a3a5a;
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

    .item-unit-price {
      color: #888;
      font-size: 0.8rem;
    }

    .item-price {
      color: #4caf50;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      font-family: inherit;
    }

    .qty-btn:hover {
      background: #646cff;
    }

    .qty-btn:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }

    .quantity {
      min-width: 2rem;
      text-align: center;
      font-weight: bold;
      font-size: 1rem;
    }

    .remove-btn {
      background: none;
      border: none;
      color: #e63946;
      cursor: pointer;
      font-size: 0.8rem;
      font-family: inherit;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      margin-left: 0.5rem;
      transition: background 0.2s;
    }

    .remove-btn:hover {
      background: rgba(230, 57, 70, 0.15);
    }

    .remove-btn:focus-visible {
      outline: 2px solid #e63946;
      outline-offset: 2px;
    }

    /* Resumen */
    .summary {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: #16213e;
      border: 1px solid #2a2a4a;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .total {
      font-size: 1.3rem;
      font-weight: bold;
    }

    .total-amount {
      color: #4caf50;
      font-size: 1.5rem;
    }

    .total-count {
      display: block;
      color: #888;
      font-size: 0.85rem;
      font-weight: normal;
      margin-top: 0.2rem;
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
      font-family: inherit;
      transition: background 0.2s;
    }

    .clear-btn:hover {
      background: rgba(230, 57, 70, 0.15);
    }

    .clear-btn:focus-visible {
      outline: 2px solid #e63946;
      outline-offset: 2px;
    }

    .checkout-btn {
      background: #4caf50;
      border: none;
      color: white;
      padding: 0.6rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.95rem;
      font-family: inherit;
      font-weight: 600;
      transition: background 0.2s;
    }

    .checkout-btn:hover {
      background: #43a047;
    }

    .checkout-btn:focus-visible {
      outline: 2px solid #4caf50;
      outline-offset: 2px;
    }

    @media (max-width: 600px) {
      .cart-item {
        grid-template-columns: 60px 1fr;
        gap: 0.75rem;
      }

      .item-actions {
        grid-column: 1 / -1;
        justify-content: flex-end;
      }

      .summary {
        flex-direction: column;
        text-align: center;
      }
    }
  `;

  render() {
    return html`
      <h1>Carrito de compras</h1>

      ${when(this.cart.isEmpty,
        () => html`
          <div class="empty" role="status">
            <svg class="empty-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.04-.12.94-1.7h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020.04 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z"/>
            </svg>
            <h2>Tu carrito está vacío</h2>
            <p>Añade productos desde el catálogo</p>
            <button class="cta-btn" @click=${() => navigate('home')}>Ir al catálogo</button>
          </div>
        `,
        () => this._renderCart()
      )}
    `;
  }

  private _renderCart() {
    return html`
      <p class="subtitle" aria-live="polite">${this.cart.count} artículo${this.cart.count !== 1 ? 's' : ''} en tu carrito</p>

      <ul class="cart-list" aria-label="Productos en el carrito">
        ${repeat(this.cart.items, (item: CartItem) => item.id, (item: CartItem) => html`
          <li class="cart-item">
            <img src=${item.image} alt="" />
            <div class="item-info">
              <h3>${item.name}</h3>
              <span class="item-unit-price">${item.price.toFixed(2)} &euro;/ud.</span>
              <br>
              <span class="item-price">${(item.price * item.quantity).toFixed(2)} &euro;</span>
            </div>
            <div class="item-actions">
              <button
                class="qty-btn"
                @click=${() => this.cart.updateQuantity(item.id, -1)}
                aria-label="Reducir cantidad de ${item.name}"
              >−</button>
              <span class="quantity" aria-label="Cantidad: ${item.quantity}">${item.quantity}</span>
              <button
                class="qty-btn"
                @click=${() => this.cart.updateQuantity(item.id, 1)}
                aria-label="Aumentar cantidad de ${item.name}"
              >+</button>
              <button
                class="remove-btn"
                @click=${() => this.cart.remove(item.id)}
                aria-label="Eliminar ${item.name} del carrito"
              >Eliminar</button>
            </div>
          </li>
        `)}
      </ul>

      <div class="summary" role="status" aria-label="Resumen del carrito">
        <div class="total">
          Total: <span class="total-amount">${this.cart.total.toFixed(2)} &euro;</span>
          <span class="total-count">${this.cart.count} artículo${this.cart.count !== 1 ? 's' : ''}</span>
        </div>
        <div class="summary-actions">
          <button class="clear-btn" @click=${() => this.cart.clear()} aria-label="Vaciar todo el carrito">Vaciar</button>
          <button class="checkout-btn">Finalizar compra</button>
        </div>
      </div>
    `;
  }
}
