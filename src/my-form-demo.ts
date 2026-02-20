import { LitElement, html, css } from 'lit';
import { customElement, query, queryAll, queryAsync, state } from 'lit/decorators.js';

// ═══════════════════════════════════════════════════════════════
// DECORADORES AVANZADOS
//
// Stencil:                          Lit:
// ──────────────────────────        ──────────────────────────
// @Element() el: HTMLElement     →  this (ya eres el elemento)
// No existe                      →  @query('#id') — querySelector
// No existe                      →  @queryAll('.cls') — querySelectorAll
// No existe                      →  @queryAsync('#id') — espera updateComplete
//
// En Stencil, para acceder a elementos internos haces:
//   this.el.shadowRoot.querySelector('#myInput')
//
// En Lit, @query es un shortcut para lo mismo, pero declarativo.
// ═══════════════════════════════════════════════════════════════

@customElement('my-form-demo')
export class MyFormDemo extends LitElement {
  // ──────────────────────────────────────────
  // @query('#selector') — querySelector en el Shadow DOM
  //
  // Equivalente en Stencil:
  //   @Element() el: HTMLElement;
  //   this.el.shadowRoot.querySelector('#name-input')
  //
  // En Lit es declarativo y con cache automático:
  // ──────────────────────────────────────────
  @query('#name-input')
  private _nameInput!: HTMLInputElement;

  @query('#email-input')
  private _emailInput!: HTMLInputElement;

  @query('#message-area')
  private _messageArea!: HTMLTextAreaElement;

  @query('.form-container')
  private _formContainer!: HTMLDivElement;

  // ──────────────────────────────────────────
  // @queryAll('.selector') — querySelectorAll
  //
  // Devuelve un NodeList con todos los matches.
  // No tiene equivalente directo en Stencil.
  // ──────────────────────────────────────────
  @queryAll('.form-field')
  private _allFields!: NodeListOf<HTMLElement>;

  // ──────────────────────────────────────────
  // @queryAsync('#selector')
  //
  // Devuelve una Promise que resuelve después de
  // que el componente termine de renderizar.
  // Útil cuando el elemento podría no existir aún.
  // ──────────────────────────────────────────
  @queryAsync('#dynamic-content')
  private _dynamicContent!: Promise<HTMLDivElement>;

  @state()
  private _submitted: Array<{ name: string; email: string; message: string }> = [];

  @state()
  private _fieldCount = 0;

  @state()
  private _showDynamic = false;

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #646cff;
      border-radius: 8px;
      max-width: 500px;
    }

    h3 { margin: 0 0 0.75rem; color: #c4c4ff; }
    h4 { margin: 1rem 0 0.5rem; color: #aaa; font-size: 0.85rem; }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    label {
      font-size: 0.85rem;
      color: #aaa;
    }

    input, textarea {
      padding: 0.4rem 0.6rem;
      border: 1px solid #555;
      border-radius: 4px;
      background: #2a2a3e;
      color: #eee;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #646cff;
    }

    textarea { min-height: 60px; resize: vertical; }

    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    button {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
      font-size: 0.85rem;
    }

    button:hover { background: #535bf2; }
    button.secondary { background: #555; }

    .info {
      padding: 0.5rem;
      background: #2a2a3e;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.8rem;
      color: #4caf50;
    }

    .submitted {
      margin-top: 0.5rem;
      padding: 0.5rem;
      border: 1px solid #333;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .label {
      display: inline-block;
      background: #333;
      padding: 0.1rem 0.4rem;
      border-radius: 3px;
      font-size: 0.7rem;
      color: #aaa;
    }

    .highlight-field {
      border-color: #ff9800 !important;
      box-shadow: 0 0 4px rgba(255, 152, 0, 0.3);
    }

    #dynamic-content {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #1a3a1a;
      border-radius: 4px;
      color: #4caf50;
    }
  `;

  // Usar @query para acceder a elementos y manipularlos
  private _focusName() {
    // @query cached: accede directamente sin querySelector
    this._nameInput.focus();
  }

  private _highlightAllFields() {
    // @queryAll: itera sobre todos los campos
    this._allFields.forEach(field => {
      const input = field.querySelector('input, textarea');
      if (input) {
        input.classList.add('highlight-field');
        setTimeout(() => input.classList.remove('highlight-field'), 1000);
      }
    });
    this._fieldCount = this._allFields.length;
  }

  private _clearForm() {
    this._nameInput.value = '';
    this._emailInput.value = '';
    this._messageArea.value = '';
    this._nameInput.focus();
  }

  private _submitForm() {
    const name = this._nameInput.value.trim();
    const email = this._emailInput.value.trim();
    const message = this._messageArea.value.trim();

    if (!name || !email) return;

    this._submitted = [...this._submitted, { name, email, message }];
    this._clearForm();
  }

  private async _toggleDynamic() {
    this._showDynamic = !this._showDynamic;

    if (this._showDynamic) {
      // @queryAsync: espera a que el elemento exista tras el render
      const el = await this._dynamicContent;
      el.textContent = `Elemento encontrado tras render (${new Date().toLocaleTimeString()})`;
    }
  }

  private _getFormRect() {
    // Acceder a dimensiones usando @query
    const rect = this._formContainer.getBoundingClientRect();
    alert(`Formulario: ${Math.round(rect.width)}x${Math.round(rect.height)}px`);
  }

  render() {
    return html`
      <h3>Decoradores avanzados</h3>

      <h4>@query('#id') <span class="label">querySelector del Shadow DOM</span></h4>
      <div class="form-container">
        <div class="form-field">
          <label for="name-input">Nombre</label>
          <input id="name-input" type="text" placeholder="Tu nombre" />
        </div>

        <div class="form-field">
          <label for="email-input">Email</label>
          <input id="email-input" type="email" placeholder="tu@email.com" />
        </div>

        <div class="form-field">
          <label for="message-area">Mensaje</label>
          <textarea id="message-area" placeholder="Escribe algo..."></textarea>
        </div>

        <div class="actions">
          <button @click=${this._submitForm}>Enviar</button>
          <button class="secondary" @click=${this._clearForm}>Limpiar</button>
          <button class="secondary" @click=${this._focusName}>Focus nombre</button>
          <button class="secondary" @click=${this._getFormRect}>Medir form</button>
        </div>
      </div>

      <!-- @queryAll demo -->
      <h4>@queryAll('.cls') <span class="label">querySelectorAll</span></h4>
      <div class="actions">
        <button @click=${this._highlightAllFields}>
          Resaltar todos los campos
        </button>
      </div>
      <div class="info">
        @queryAll('.form-field'): ${this._fieldCount} campos encontrados
      </div>

      <!-- @queryAsync demo -->
      <h4>@queryAsync('#id') <span class="label">espera render</span></h4>
      <div class="actions">
        <button @click=${this._toggleDynamic}>
          ${this._showDynamic ? 'Ocultar' : 'Mostrar'} contenido dinámico
        </button>
      </div>
      ${this._showDynamic ? html`<div id="dynamic-content">Cargando...</div>` : ''}

      <!-- Resultados -->
      ${this._submitted.length > 0 ? html`
        <h4>Envíos (${this._submitted.length})</h4>
        ${this._submitted.map(s => html`
          <div class="submitted">
            <strong>${s.name}</strong> (${s.email})
            ${s.message ? html` — ${s.message}` : ''}
          </div>
        `)}
      ` : ''}
    `;
  }
}
