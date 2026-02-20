import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ═══════════════════════════════════════════════════════════════
// SLOTS en Lit vs Stencil
//
// Los slots funcionan IGUAL en ambos — es API estándar de Shadow DOM.
// La única diferencia es la sintaxis del template:
//
// Stencil (JSX):  <slot />         <slot name="header" />
// Lit:            <slot></slot>    <slot name="header"></slot>
//
// Uso desde fuera (idéntico en ambos):
//   <my-comp>
//     <p>Contenido default</p>
//     <h2 slot="header">Título</h2>
//   </my-comp>
// ═══════════════════════════════════════════════════════════════

// Componente de item individual del acordeón
@customElement('my-accordion-item')
export class MyAccordionItem extends LitElement {
  @property({ type: String })
  header = '';

  @property({ type: Boolean, reflect: true })
  open = false;

  static styles = css`
    :host {
      display: block;
      border: 1px solid #444;
      border-radius: 4px;
      overflow: hidden;
    }

    :host(:not(:last-child)) {
      margin-bottom: 0.5rem;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #2a2a3e;
      cursor: pointer;
      user-select: none;
    }

    .header:hover {
      background: #333352;
    }

    .arrow {
      transition: transform 0.2s;
    }

    :host([open]) .arrow {
      transform: rotate(90deg);
    }

    .content {
      display: none;
      padding: 1rem;
      border-top: 1px solid #444;
    }

    :host([open]) .content {
      display: block;
    }

    /* ::slotted() — estiliza contenido proyectado */
    ::slotted(p) {
      margin: 0.25rem 0;
      line-height: 1.5;
    }

    ::slotted(code) {
      background: #1a1a2e;
      padding: 0.15rem 0.4rem;
      border-radius: 3px;
      font-size: 0.9rem;
    }

    /* Slot con nombre: estiliza según el atributo slot */
    ::slotted([slot="icon"]) {
      margin-right: 0.5rem;
    }
  `;

  private _toggle() {
    this.open = !this.open;

    // Emitir evento para que el padre pueda reaccionar
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: { open: this.open },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div class="header" @click=${this._toggle}>
        <span>
          <!-- Named slot: solo renderiza si el padre pasa contenido con slot="icon" -->
          <slot name="icon"></slot>
          ${this.header}
        </span>
        <span class="arrow">▶</span>
      </div>
      <div class="content">
        <!-- Default slot: todo contenido sin atributo slot va aquí -->
        <slot></slot>
      </div>
    `;
  }
}

// Componente contenedor que demuestra slots y slotchange
@customElement('my-slot-demo')
export class MySlotDemo extends LitElement {
  @state()
  private _slotInfo = '';

  @state()
  private _dynamicItems: string[] = [];

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

    .slot-monitor {
      margin-top: 1rem;
      padding: 0.5rem;
      background: #2a2a3e;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.8rem;
      color: #4caf50;
    }

    .controls {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    button {
      padding: 0.3rem 0.6rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
      font-size: 0.8rem;
    }

    button:hover { background: #535bf2; }

    /* Fallback content: se muestra si no hay contenido en el slot */
    .fallback-demo {
      margin-top: 0.5rem;
      padding: 0.75rem;
      border: 1px dashed #555;
      border-radius: 4px;
    }

    ::slotted(.highlight) {
      background: rgba(100, 108, 255, 0.2);
      padding: 0.25rem;
      border-radius: 3px;
    }
  `;

  private _addItem() {
    this._dynamicItems = [...this._dynamicItems, `Item dinámico #${this._dynamicItems.length + 1}`];
  }

  private _removeItem() {
    this._dynamicItems = this._dynamicItems.slice(0, -1);
  }

  // slotchange — se dispara cuando cambia el contenido de un slot
  // Es un evento nativo del Shadow DOM, funciona igual en Stencil
  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const assigned = slot.assignedNodes({ flatten: true });
    const elements = assigned.filter(n => n.nodeType === Node.ELEMENT_NODE);
    this._slotInfo = `Slot "${slot.name || 'default'}": ${elements.length} elementos asignados`;
  }

  render() {
    return html`
      <h3>Slots y composición</h3>

      <!-- Acordeón con slots -->
      <h4>Named slots + default slot</h4>
      <my-accordion-item header="Default slot">
        <p>Este contenido va al <strong>slot por defecto</strong> (sin nombre).</p>
        <p>Cualquier hijo sin atributo <code>slot="..."</code> va aquí.</p>
      </my-accordion-item>

      <my-accordion-item header="Named slot (icon)" open>
        <!-- Named slot: el contenido se proyecta en <slot name="icon"> -->
        <span slot="icon">📦</span>
        <p>El icono 📦 se proyecta en el <code>slot name="icon"</code> del header.</p>
        <p>El resto va al slot default del contenido.</p>
      </my-accordion-item>

      <my-accordion-item header="Múltiples elementos en un slot">
        <p>Primer párrafo</p>
        <p>Segundo párrafo</p>
        <p>Todos van al mismo slot default.</p>
      </my-accordion-item>

      <!-- Fallback content: contenido por defecto del slot -->
      <h4>Fallback content</h4>
      <div class="fallback-demo">
        <slot name="extra">
          <!-- Este texto se muestra si nadie pasa contenido con slot="extra" -->
          <p style="color: #666; font-style: italic;">
            Fallback: no se ha proporcionado contenido para slot="extra".
            Este texto desaparece cuando se proyecta contenido real.
          </p>
        </slot>
      </div>

      <!-- slotchange: monitorear cambios en el slot -->
      <h4>slotchange event</h4>
      <div class="controls">
        <button @click=${this._addItem}>+ Añadir item</button>
        <button @click=${this._removeItem}>- Quitar item</button>
      </div>
      <slot @slotchange=${this._onSlotChange}>
        ${this._dynamicItems.map(item => html`<p>${item}</p>`)}
      </slot>
      <div class="slot-monitor">${this._slotInfo || 'Esperando slotchange...'}</div>
    `;
  }
}
