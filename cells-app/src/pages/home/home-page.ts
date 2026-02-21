import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import '../../components/feature-card.js';

// ═══════════════════════════════════════════════════════════════
// PÁGINA HOME con PageController
//
// PageController es un Reactive Controller (como los que
// vimos en la rama 10-reactive-controllers).
//
// Proporciona:
//   - navigate(name, params?) — Navegar a otra página
//   - subscribe/unsubscribe — Canales pub/sub (rama 15)
//   - onPageEnter/onPageLeave — Lifecycle de la página
//
// Se instancia como class field, igual que ClockController:
//   pageController = new PageController(this);
//
// Stencil equivalente:
//   No existe. Usarías @stencil/router + servicios manuales.
// ═══════════════════════════════════════════════════════════════

@customElement('home-page')
export class HomePage extends LitElement {
  pageController = new PageController(this);

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: #646cff;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #888;
      margin-bottom: 2rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .nav-section {
      padding: 1.5rem;
      background: #2a2a3e;
      border-radius: 8px;
      border: 1px solid #333;
    }

    .nav-section h3 {
      color: #c4c4ff;
      margin: 0 0 0.75rem;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
      font-size: 0.9rem;
      margin-right: 0.5rem;
    }

    button:hover { background: #535bf2; }

    code {
      background: #1a1a2e;
      padding: 0.15rem 0.4rem;
      border-radius: 3px;
      color: #4caf50;
      font-size: 0.85em;
    }

    .hint {
      margin-top: 0.75rem;
      font-size: 0.8rem;
      color: #666;
      font-family: monospace;
    }
  `;

  render() {
    return html`
      <h1>Home</h1>
      <p class="subtitle">App Open Cells + Lit — Componentes integrados</p>

      <div class="grid">
        <feature-card
          icon="🏗️"
          title="Open Cells"
          description="Framework de micro-frontends de BBVA con routing y estado"
        ></feature-card>
        <feature-card
          icon="🔥"
          title="Lit"
          description="Web Components reactivos, ligeros y estándar"
        ></feature-card>
        <feature-card
          icon="🔄"
          title="PageController"
          description="Reactive Controller para lifecycle y navegación de páginas"
        ></feature-card>
      </div>

      <div class="nav-section">
        <h3>Navegación con PageController</h3>
        <p style="color: #aaa; margin-bottom: 0.75rem;">
          Usa <code>pageController.navigate(name)</code> para navegar programáticamente:
        </p>
        <button @click=${() => this.pageController.navigate('about')}>
          Ir a About
        </button>
        <button @click=${() => this.pageController.navigate('demo')}>
          Ir a Demo Lit
        </button>
        <div class="hint">
          this.pageController.navigate('about')
        </div>
      </div>
    `;
  }
}
