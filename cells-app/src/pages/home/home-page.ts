import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

// ═══════════════════════════════════════════════════════════════
// PÁGINA HOME
//
// En Open Cells, cada página es un web component normal.
// El router se encarga de:
//   1. Crear el elemento <home-page>
//   2. Insertarlo en el DOM
//   3. Quitarlo cuando se navega a otra ruta
//
// Comparación con Stencil:
//   En Stencil + stencil-router, la página también es un
//   componente, pero el routing lo maneja <stencil-router-redirect>.
//   Aquí es Open Cells quien orquesta todo.
// ═══════════════════════════════════════════════════════════════

@customElement('home-page')
export class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: #646cff;
      margin-bottom: 1rem;
    }

    p {
      color: #ccc;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .card {
      padding: 1.5rem;
      background: #2a2a3e;
      border-radius: 8px;
      border: 1px solid #333;
      margin-bottom: 1rem;
    }

    .card h3 {
      color: #c4c4ff;
      margin-bottom: 0.5rem;
    }

    code {
      background: #1a1a2e;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-size: 0.9em;
      color: #4caf50;
    }
  `;

  render() {
    return html`
      <h1>Home</h1>
      <p>Esta es la página principal de nuestra app Open Cells + Lit.</p>

      <div class="card">
        <h3>Arquitectura Open Cells</h3>
        <p>
          Open Cells organiza la app en <strong>páginas</strong> que son
          web components estándar. El core se encarga del routing y la
          gestión del ciclo de vida de cada página.
        </p>
      </div>

      <div class="card">
        <h3>Esta página es un LitElement</h3>
        <p>
          Registrada como <code>&lt;home-page&gt;</code>, es un componente
          Lit normal con Shadow DOM, estilos encapsulados y reactividad.
        </p>
      </div>
    `;
  }
}
