import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { navigate } from '@open-cells/core';
import { CartController } from '../controllers/cart-controller.js';

// ═══════════════════════════════════════════════════════════════
// HEADER — Ahora con CartController para mostrar el badge
//
// El CartController funciona en cualquier componente Lit,
// no solo en páginas de Cells. Aquí lo usamos para mostrar
// el número de items en el carrito.
//
// Demuestra que los Reactive Controllers son reutilizables
// en cualquier contexto (página, componente compartido, etc.)
// ═══════════════════════════════════════════════════════════════

@customElement('app-header')
export class AppHeader extends LitElement {
  // CartController funciona aquí igual que en las páginas
  cart = new CartController(this);

  static styles = css`
    :host {
      display: block;
      background: #1a1a2e;
      border-bottom: 2px solid #646cff;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .logo {
      font-weight: bold;
      font-size: 1.1rem;
      color: #646cff;
      margin-right: auto;
    }

    button {
      background: none;
      border: none;
      color: #aaa;
      cursor: pointer;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: all 0.2s;
      position: relative;
    }

    button:hover {
      color: white;
      background: #2a2a3e;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #4caf50;
      color: white;
      font-size: 0.7rem;
      font-weight: bold;
      min-width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      margin-left: 0.3rem;
    }
  `;

  render() {
    return html`
      <nav>
        <span class="logo">Cells + Lit</span>
        <button @click=${() => navigate('home')}>Home</button>
        <button @click=${() => navigate('about')}>About</button>
        <button @click=${() => navigate('demo')}>Demo</button>
        <button @click=${() => navigate('cart')}>
          Carrito
          ${when(!this.cart.isEmpty, () => html`
            <span class="badge">${this.cart.count}</span>
          `)}
        </button>
        <button @click=${() => navigate('protected')}>Login</button>
      </nav>
    `;
  }
}
