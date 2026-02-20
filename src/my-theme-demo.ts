import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './my-card.js';

// Este componente demuestra cómo personalizar estilos desde fuera
// del Shadow DOM usando:
//   1. CSS custom properties (variables)
//   2. ::part() para acceder a partes expuestas
@customElement('my-theme-demo')
export class MyThemeDemo extends LitElement {
  @state()
  private _darkMode = true;

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #888;
      border-radius: 8px;
      max-width: 500px;
    }

    h3 { margin: 0 0 0.75rem; color: #c4c4ff; }

    .controls {
      margin-bottom: 1rem;
    }

    button {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
    }

    .cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* ═══════════════════════════════════════════════
       CSS CUSTOM PROPERTIES — Personalizar hijo
       desde el padre a través del Shadow DOM

       Las variables CSS son la ÚNICA forma de pasar
       estilos "hacia abajo" a través del Shadow DOM.
       Esto funciona igual en Stencil.
       ═══════════════════════════════════════════════ */
    .themed-card {
      --card-bg: #1e1e3a;
      --card-header-color: #ff9800;
    }

    :host([light]) .themed-card {
      --card-bg: #f5f5f5;
      --card-header-color: #333;
      --card-border-color: #ccc;
    }

    /* ═══════════════════════════════════════════════
       ::part() — Estilizar partes expuestas del hijo
       El hijo expone <div part="header"> y <div part="content">
       y desde aquí podemos estilizarlas directamente.
       Funciona igual en Stencil.
       ═══════════════════════════════════════════════ */
    .styled-via-part::part(header) {
      font-style: italic;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .styled-via-part::part(content) {
      font-size: 0.9rem;
    }

    /* Estilo para modo claro */
    :host([light]) {
      background: #fff;
      border-color: #ddd;
      color: #333;
    }

    :host([light]) h3 { color: #333; }
  `;

  private _toggleTheme() {
    this._darkMode = !this._darkMode;
    if (this._darkMode) {
      this.removeAttribute('light');
    } else {
      this.setAttribute('light', '');
    }
  }

  render() {
    return html`
      <h3>Personalización de estilos</h3>

      <div class="controls">
        <button @click=${this._toggleTheme}>
          Cambiar a modo ${this._darkMode ? 'claro' : 'oscuro'}
        </button>
      </div>

      <div class="cards">
        <!-- Variantes via atributo (internamente usa :host([variant])) -->
        <my-card heading="Default" variant="default">
          <p>Estilo por defecto del componente.</p>
        </my-card>

        <my-card heading="Primary" variant="primary">
          <p>Variante primary con borde azul.</p>
        </my-card>

        <my-card heading="Danger" variant="danger">
          <p>Variante danger con borde rojo.</p>
          <div slot="footer">Slot "footer" con estilos via ::slotted()</div>
        </my-card>

        <!-- Personalizado via CSS custom properties -->
        <my-card heading="Custom Properties" class="themed-card">
          <p>Fondo y colores cambiados desde el padre con variables CSS.</p>
          <p>Las variables CSS atraviesan el Shadow DOM.</p>
        </my-card>

        <!-- Personalizado via ::part() -->
        <my-card heading="Styled via ::part()" class="styled-via-part" variant="primary">
          <p>El header tiene italic y uppercase gracias a ::part(header).</p>
        </my-card>
      </div>
    `;
  }
}
