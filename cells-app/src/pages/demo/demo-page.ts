import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import '../../components/feature-card.js';

// ═══════════════════════════════════════════════════════════════
// PÁGINA DEMO — Componentes Lit dentro de Cells
//
// Esta página demuestra que dentro de una app Cells,
// los componentes Lit funcionan exactamente igual:
//   - @property, @state, eventos, Shadow DOM, estilos...
//   - Se pueden importar y usar como en cualquier app Lit.
//
// Además usa PageController para:
//   - Detectar cuándo la página entra/sale (onPageEnter/Leave)
//   - Navegación programática
//
// PageController es un Reactive Controller de Lit.
// Se instancia igual que ClockController o MouseController
// que vimos en la rama 10-reactive-controllers.
//
// Comparación con Stencil:
//   En Stencil no hay un concepto equivalente a PageController.
//   Lo más parecido sería un servicio que escucha cambios de ruta.
// ═══════════════════════════════════════════════════════════════

@customElement('demo-page')
export class DemoPage extends LitElement {
  // PageController se conecta al lifecycle de la página
  pageController = new PageController(this);

  @state()
  private _enterCount = 0;

  @state()
  private _lastEnter = '';

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
      margin-bottom: 1.5rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .lifecycle-info {
      padding: 1rem;
      background: #1a3a1a;
      border-radius: 8px;
      border: 1px solid #2a5a2a;
      margin-bottom: 1.5rem;
    }

    .lifecycle-info h3 {
      color: #4caf50;
      margin: 0 0 0.5rem;
      font-size: 0.95rem;
    }

    .lifecycle-info p {
      color: #aaa;
      margin: 0.25rem 0;
      font-size: 0.85rem;
    }

    code {
      background: #1a1a2e;
      padding: 0.15rem 0.4rem;
      border-radius: 3px;
      color: #4caf50;
      font-size: 0.85em;
    }

    .counter-demo {
      padding: 1rem;
      background: #2a2a3e;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .counter-demo button {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
    }

    .counter-demo button:hover { background: #535bf2; }

    .counter-demo .count {
      font-size: 1.5rem;
      font-weight: bold;
      min-width: 3rem;
      text-align: center;
    }
  `;

  @state()
  private _count = 0;

  // Lifecycle de Open Cells: se llama al entrar a la página
  onPageEnter() {
    this._enterCount++;
    this._lastEnter = new Date().toLocaleTimeString();
  }

  // Lifecycle de Open Cells: se llama al salir de la página
  onPageLeave() {
    // Aquí podrías limpiar timers, cancelar requests, etc.
  }

  render() {
    return html`
      <h1>Demo: Lit en Cells</h1>
      <p class="subtitle">Componentes Lit reutilizables dentro de una página Cells</p>

      <!-- PageController lifecycle info -->
      <div class="lifecycle-info">
        <h3>PageController lifecycle</h3>
        <p>Veces que entraste a esta página: <strong>${this._enterCount}</strong></p>
        <p>Última entrada: <strong>${this._lastEnter || 'ahora'}</strong></p>
        <p>
          <code>onPageEnter()</code> se llama cada vez que navegas a esta página.
          Navega a otra página y vuelve para ver el contador incrementar.
        </p>
      </div>

      <!-- Componentes Lit reutilizables -->
      <h3 style="color: #c4c4ff; margin-bottom: 0.75rem;">Componentes Lit reutilizables</h3>
      <div class="grid">
        <feature-card
          icon="🧩"
          title="Web Components"
          description="Componentes estándar que funcionan en cualquier framework"
        ></feature-card>
        <feature-card
          icon="⚡"
          title="Reactivos"
          description="@property y @state funcionan igual que siempre"
        ></feature-card>
        <feature-card
          icon="🎨"
          title="Shadow DOM"
          description="Estilos encapsulados sin conflictos"
        ></feature-card>
      </div>

      <!-- Demo interactiva -->
      <h3 style="color: #c4c4ff; margin-bottom: 0.75rem;">Estado local (funciona igual)</h3>
      <div class="counter-demo">
        <button @click=${() => this._count--}>-</button>
        <span class="count">${this._count}</span>
        <button @click=${() => this._count++}>+</button>
        <span style="color: #888; font-size: 0.85rem;">
          @state() sigue funcionando dentro de Cells
        </span>
      </div>
    `;
  }
}
