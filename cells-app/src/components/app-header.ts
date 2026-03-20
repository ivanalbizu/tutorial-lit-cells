import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { navigate } from '@open-cells/core';
import { CartController } from '../controllers/cart-controller.js';
import { WishlistController } from '../controllers/wishlist-controller.js';

@customElement('app-header')
export class AppHeader extends LitElement {
  cart = new CartController(this);
  wishlist = new WishlistController(this);

  static styles = css`
    :host {
      display: block;
      background: #16213e;
      border-bottom: 2px solid #646cff;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 0.25rem;
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
      background: none;
      border: none;
      font-family: inherit;
    }

    .logo:hover {
      color: #535bf2;
    }

    .nav-btn {
      background: none;
      border: 1px solid transparent;
      color: #ccc;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.95rem;
      font-family: inherit;
      transition: color 0.2s, background 0.2s, border-color 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-btn:hover {
      color: white;
      background: #2a2a3e;
    }

    .nav-btn:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }

    .icon {
      width: 18px;
      height: 18px;
      fill: currentColor;
      flex-shrink: 0;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
      min-width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      padding: 0 0.3rem;
    }

    .badge-cart {
      background: #e63946;
    }

    .badge-wish {
      background: #e91e63;
    }
  `;

  render() {
    return html`
      <nav aria-label="Navegación principal">
        <button class="logo" @click=${() => navigate('home')} aria-label="TechShop — Ir al inicio">
          TechShop
        </button>
        <button class="nav-btn" @click=${() => navigate('home')}>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          Catálogo
        </button>
        <button class="nav-btn" @click=${() => navigate('home')} aria-label="Favoritos${this.wishlist.count > 0 ? `, ${this.wishlist.count} productos` : ''}">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Favoritos
          ${when(this.wishlist.count > 0, () => html`
            <span class="badge badge-wish" aria-live="polite">${this.wishlist.count}</span>
          `)}
        </button>
        <button class="nav-btn" @click=${() => navigate('cart')} aria-label="Carrito${!this.cart.isEmpty ? `, ${this.cart.count} artículos` : ', vacío'}">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.04-.12.94-1.7h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020.04 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25z"/>
          </svg>
          Carrito
          ${when(!this.cart.isEmpty, () => html`
            <span class="badge badge-cart" aria-live="polite">${this.cart.count}</span>
          `)}
        </button>
      </nav>
    `;
  }
}
