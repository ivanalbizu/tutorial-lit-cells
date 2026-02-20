import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Componente que demuestra:
 * - Múltiples @property con distintos tipos (String, Number, Boolean, Object)
 * - @state para estado interno
 * - Cómo Lit convierte atributos HTML (strings) a los tipos correctos
 */
@customElement('my-user-card')
export class MyUserCard extends LitElement {
  // String — tipo por defecto, no necesita converter
  @property({ type: String })
  name = 'Anónimo';

  // Number — Lit convierte el atributo "age" (string) a number automáticamente
  @property({ type: Number })
  age = 0;

  // Boolean — En HTML: <my-user-card active> (presente = true, ausente = false)
  // Igual que en Stencil con @Prop({ type: Boolean })
  @property({ type: Boolean, reflect: true })
  active = false;

  // Estado interno: no se expone como atributo
  @state()
  private _showDetails = false;

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #888;
      border-radius: 8px;
      max-width: 300px;
    }

    /* :host() con selector — aplica estilos cuando el atributo está presente */
    :host([active]) {
      border-color: #4caf50;
    }

    .name {
      font-size: 1.3rem;
      font-weight: bold;
    }

    .badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }

    .badge.active {
      background: #4caf50;
      color: white;
    }

    .badge.inactive {
      background: #666;
      color: #ccc;
    }

    .details {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      font-size: 0.85rem;
    }

    button {
      margin-top: 0.5rem;
      background: none;
      border: 1px solid #888;
      color: #ccc;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      cursor: pointer;
    }
  `;

  private _toggleDetails() {
    this._showDetails = !this._showDetails;
  }

  render() {
    return html`
      <div class="name">
        ${this.name}
        <span class="badge ${this.active ? 'active' : 'inactive'}">
          ${this.active ? 'activo' : 'inactivo'}
        </span>
      </div>

      <button @click=${this._toggleDetails}>
        ${this._showDetails ? 'Ocultar' : 'Ver'} detalles
      </button>

      ${this._showDetails
        ? html`
            <div class="details">
              <p>Edad: ${this.age}</p>
              <p>Estado: ${this.active ? 'Activo' : 'Inactivo'}</p>
            </div>
          `
        : ''}
    `;
  }
}
