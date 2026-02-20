import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * En Stencil harías:
 *
 * @Component({ tag: 'my-counter', shadow: true })
 * export class MyCounter {
 *   @Prop() label: string = 'Contador';     // pública, viene del padre
 *   @Prop() step: number = 1;               // pública, configurable
 *   @State() count: number = 0;             // privada, solo interna
 *
 *   private increment() { this.count += this.step; }
 *   private decrement() { this.count -= this.step; }
 *
 *   render() {
 *     return (
 *       <div>
 *         <h3>{this.label}</h3>
 *         <button onClick={() => this.decrement()}>-</button>
 *         <span>{this.count}</span>
 *         <button onClick={() => this.increment()}>+</button>
 *       </div>
 *     );
 *   }
 * }
 */

@customElement('my-counter')
export class MyCounter extends LitElement {
  // ──────────────────────────────────────────────
  // @property() → equivalente a @Prop() en Stencil
  // ──────────────────────────────────────────────
  // - Es PÚBLICA: se puede establecer desde fuera (atributo HTML o JS)
  // - Cambio → re-render automático
  // - reflect: true → sincroniza propiedad JS ↔ atributo HTML
  @property({ type: String })
  label = 'Contador';

  @property({ type: Number })
  step = 1;

  // ──────────────────────────────────────────────
  // @state() → equivalente a @State() en Stencil
  // ──────────────────────────────────────────────
  // - Es PRIVADA: solo para uso interno del componente
  // - Cambio → re-render automático (igual que @property)
  // - NO se expone como atributo HTML
  // - Convención: prefijo _ para indicar que es interna
  @state()
  private _count = 0;

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #646cff;
      border-radius: 8px;
      max-width: 300px;
      text-align: center;
    }

    h3 {
      margin: 0 0 0.5rem;
      color: #c4c4ff;
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    button {
      background: #646cff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      cursor: pointer;
    }

    button:hover {
      background: #535bf2;
    }

    .value {
      font-size: 2rem;
      font-weight: bold;
      min-width: 3rem;
    }

    .info {
      margin-top: 0.75rem;
      font-size: 0.8rem;
      color: #888;
    }
  `;

  private _increment() {
    this._count += this.step;
  }

  private _decrement() {
    this._count -= this.step;
  }

  render() {
    return html`
      <h3>${this.label}</h3>
      <div class="controls">
        <!-- En Lit: @click en vez de onClick (JSX) -->
        <button @click=${this._decrement}>-</button>
        <span class="value">${this._count}</span>
        <button @click=${this._increment}>+</button>
      </div>
      <div class="info">
        step: ${this.step} |
        @property = label, step (públicas) |
        @state = _count (privada)
      </div>
    `;
  }
}
