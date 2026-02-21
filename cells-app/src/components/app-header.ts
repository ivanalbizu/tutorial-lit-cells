import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { navigate } from '@open-cells/core';

// ═══════════════════════════════════════════════════════════════
// COMPONENTE COMPARTIDO — Header de navegación
//
// Este es un componente Lit normal, no una "página" de Cells.
// Se usa como pieza reutilizable dentro de la app.
//
// Para navegar usamos navigate() de @open-cells/core,
// que es la función global de navegación.
//
// Equivalencias:
//   Stencil:   this.history.push('/about') o <stencil-route-link>
//   React:     useNavigate() o <Link to="/about">
//   Angular:   router.navigate(['/about'])
//   Vue:       router.push('/about')
// ═══════════════════════════════════════════════════════════════

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String })
  activePage = '';

  static styles = css`
    :host {
      display: block;
      background: #1a1a2e;
      border-bottom: 2px solid #646cff;
    }

    nav {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .logo {
      font-weight: bold;
      font-size: 1.1rem;
      color: #646cff;
      margin-right: 1rem;
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
    }

    button:hover {
      color: white;
      background: #2a2a3e;
    }

    button.active {
      color: #646cff;
      background: #2a2a3e;
    }
  `;

  private _navigate(name: string) {
    navigate(name);
  }

  render() {
    return html`
      <nav>
        <span class="logo">Cells + Lit</span>
        <button
          class=${this.activePage === 'home' ? 'active' : ''}
          @click=${() => this._navigate('home')}
        >
          Home
        </button>
        <button
          class=${this.activePage === 'about' ? 'active' : ''}
          @click=${() => this._navigate('about')}
        >
          About
        </button>
        <button
          class=${this.activePage === 'demo' ? 'active' : ''}
          @click=${() => this._navigate('demo')}
        >
          Demo Lit
        </button>
        <button @click=${() => this._navigate('cart')}>
          Carrito
        </button>
        <button @click=${() => this._navigate('protected')}>
          Zona protegida
        </button>
      </nav>
    `;
  }
}
