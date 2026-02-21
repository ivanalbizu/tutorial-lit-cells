import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// ═══════════════════════════════════════════════════════════════
// COMPONENTE REUTILIZABLE — Feature Card
//
// Componente Lit puro, sin dependencia de Cells.
// Se puede usar en cualquier página, igual que harías
// en Stencil con un componente "presentacional".
//
// Demuestra que dentro de Cells, los componentes Lit
// funcionan exactamente igual que sin Cells.
// ═══════════════════════════════════════════════════════════════

@customElement('feature-card')
export class FeatureCard extends LitElement {
  @property()
  icon = '';

  @property()
  title = '';

  @property()
  description = '';

  static styles = css`
    :host {
      display: block;
    }

    .card {
      padding: 1.25rem;
      background: #2a2a3e;
      border-radius: 8px;
      border: 1px solid #333;
      transition: border-color 0.2s;
    }

    .card:hover {
      border-color: #646cff;
    }

    .icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    h4 {
      margin: 0 0 0.5rem;
      color: #c4c4ff;
    }

    p {
      margin: 0;
      color: #aaa;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  `;

  render() {
    return html`
      <div class="card">
        <div class="icon">${this.icon}</div>
        <h4>${this.title}</h4>
        <p>${this.description}</p>
      </div>
    `;
  }
}
