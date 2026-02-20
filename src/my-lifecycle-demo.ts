import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './my-clock.js';

// Este componente demuestra connectedCallback/disconnectedCallback
// montando y desmontando my-clock dinámicamente
@customElement('my-lifecycle-demo')
export class MyLifecycleDemo extends LitElement {
  @state()
  private _showClock = true;

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #888;
      border-radius: 8px;
      max-width: 450px;
    }

    .controls {
      margin-bottom: 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
    }

    button:hover { background: #535bf2; }

    .status {
      font-size: 0.85rem;
      color: #888;
    }

    .hint {
      margin-top: 0.75rem;
      font-size: 0.8rem;
      color: #666;
      line-height: 1.4;
    }
  `;

  private _toggle() {
    this._showClock = !this._showClock;
  }

  render() {
    return html`
      <div class="controls">
        <button @click=${this._toggle}>
          ${this._showClock ? 'Desmontar' : 'Montar'} reloj
        </button>
        <span class="status">
          ${this._showClock ? 'Montado (connectedCallback activo)' : 'Desmontado (disconnectedCallback ejecutado)'}
        </span>
      </div>

      ${this._showClock ? html`<my-clock></my-clock>` : html`<p style="color:#666;">Reloj desmontado. El timer se ha limpiado.</p>`}

      <div class="hint">
        Pulsa "Desmontar" y observa la consola del navegador:
        disconnectedCallback limpia el setInterval.
        Al volver a montar, connectedCallback lo recrea.
      </div>
    `;
  }
}
