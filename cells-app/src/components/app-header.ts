import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { navigate } from '@open-cells/core';
import { CartController } from '../controllers/cart-controller.js';

@customElement('app-header')
export class AppHeader extends LitElement {
  cart = new CartController(this);

  static styles = css`
    :host {
      display: block;
      background: #16213e;
      border-bottom: 2px solid #646cff;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .logo {
      font-weight: bold;
      font-size: 1.2rem;
      color: #646cff;
      margin-right: auto;
      cursor: pointer;
    }

    .logo:hover {
      color: #535bf2;
    }

    button {
      background: none;
      border: none;
      color: #aaa;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    button:hover {
      color: white;
      background: #2a2a3e;
    }

    .cart-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #e63946;
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
      min-width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      padding: 0 0.3rem;
    }
  `;

  render() {
    return html`
      <nav>
        <span class="logo" @click=${() => navigate('home')}>TechShop</span>
        <button @click=${() => navigate('home')}>Catálogo</button>
        <button class="cart-btn" @click=${() => navigate('cart')}>
          Carrito
          ${when(!this.cart.isEmpty, () => html`
            <span class="badge">${this.cart.count}</span>
          `)}
        </button>
      </nav>
    `;
  }
}
