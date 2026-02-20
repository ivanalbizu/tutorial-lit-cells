import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// ═══════════════════════════════════════════════════════════════
// CICLO DE VIDA: Stencil vs Lit
//
// Stencil:                        Lit (LitElement):
// ─────────────────────────────   ─────────────────────────────
// connectedCallback()          →  connectedCallback()
// componentWillLoad()          →  (no existe, usa connectedCallback o constructor)
// componentDidLoad()           →  firstUpdated()
// componentWillRender()        →  willUpdate(changedProps)
// render()                     →  render()
// componentDidRender()         →  updated(changedProps)
// componentWillUpdate()        →  willUpdate(changedProps)
// componentDidUpdate()         →  updated(changedProps)
// disconnectedCallback()       →  disconnectedCallback()
//
// @Watch('prop')               →  willUpdate(changedProps) o updated(changedProps)
//                                  changedProps.has('prop') para filtrar
// ═══════════════════════════════════════════════════════════════

@customElement('my-clock')
export class MyClock extends LitElement {
  @state()
  private _time = new Date();

  @state()
  private _ticks = 0;

  @state()
  private _log: string[] = [];

  private _intervalId?: number;

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #646cff;
      border-radius: 8px;
      max-width: 400px;
    }

    h3 { margin: 0 0 0.5rem; color: #c4c4ff; }

    .time {
      font-size: 2rem;
      font-weight: bold;
      font-family: monospace;
    }

    .ticks {
      font-size: 0.85rem;
      color: #888;
      margin-top: 0.25rem;
    }

    .log {
      margin-top: 0.75rem;
      padding: 0.5rem;
      background: #2a2a3e;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.75rem;
      max-height: 150px;
      overflow-y: auto;
    }

    .log-entry { padding: 0.1rem 0; }
    .log-entry.connect { color: #4caf50; }
    .log-entry.disconnect { color: #f44336; }
    .log-entry.first { color: #ff9800; }
    .log-entry.will { color: #2196f3; }
    .log-entry.did { color: #9c27b0; }
  `;

  private _addLog(type: string, msg: string) {
    const time = new Date().toLocaleTimeString();
    this._log = [...this._log, `[${time}] ${type}: ${msg}`];
  }

  // ──────────────────────────────────────────
  // 1. constructor() — Igual en Stencil y Lit
  // ──────────────────────────────────────────
  // Se ejecuta una vez al crear la instancia.
  // Ideal para: inicializar estado por defecto.
  // NO accedas al DOM aquí (Shadow DOM aún no existe).
  constructor() {
    super(); // obligatorio en LitElement
    console.log('[my-clock] constructor');
  }

  // ──────────────────────────────────────────
  // 2. connectedCallback() — Igual en ambos
  // ──────────────────────────────────────────
  // Se ejecuta cuando el elemento se añade al DOM.
  // Ideal para: suscripciones, timers, event listeners globales.
  // En Stencil: connectedCallback() o componentWillLoad()
  connectedCallback() {
    super.connectedCallback(); // obligatorio
    this._addLog('connect', 'connectedCallback — elemento añadido al DOM');

    this._intervalId = window.setInterval(() => {
      this._time = new Date();
      this._ticks++;
    }, 1000);
  }

  // ──────────────────────────────────────────
  // 3. disconnectedCallback() — Igual en ambos
  // ──────────────────────────────────────────
  // Se ejecuta cuando el elemento se quita del DOM.
  // Ideal para: limpiar suscripciones, timers, listeners.
  disconnectedCallback() {
    super.disconnectedCallback(); // obligatorio
    console.log('[my-clock] disconnectedCallback — limpiando timer');

    if (this._intervalId !== undefined) {
      clearInterval(this._intervalId);
    }
  }

  // ──────────────────────────────────────────
  // 4. willUpdate(changedProps) — Equivale a:
  //    - componentWillRender() en Stencil
  //    - @Watch('prop') en Stencil
  // ──────────────────────────────────────────
  // Se ejecuta ANTES de cada render cuando hay cambios.
  // changedProps es un Map con las propiedades que cambiaron.
  // Puedes modificar estado aquí SIN causar un render extra.
  willUpdate(changedProps: Map<string, unknown>) {
    if (changedProps.has('_ticks')) {
      // Equivalente a @Watch('ticks') en Stencil
      if (this._ticks > 0 && this._ticks % 10 === 0) {
        this._addLog('will', `willUpdate — ¡${this._ticks} ticks!`);
      }
    }
  }

  // ──────────────────────────────────────────
  // 5. render() — Igual en ambos
  // ──────────────────────────────────────────
  // Debe ser puro: solo retorna template, sin side effects.

  // ──────────────────────────────────────────
  // 6. firstUpdated() — Equivale a componentDidLoad()
  // ──────────────────────────────────────────
  // Se ejecuta una sola vez, después del primer render.
  // Ideal para: acceder al Shadow DOM, medir dimensiones, focus.
  firstUpdated() {
    this._addLog('first', 'firstUpdated — primer render completo (= componentDidLoad)');
  }

  // ──────────────────────────────────────────
  // 7. updated(changedProps) — Equivale a:
  //    - componentDidRender() en Stencil
  //    - componentDidUpdate() en Stencil
  // ──────────────────────────────────────────
  // Se ejecuta DESPUÉS de cada render.
  // El DOM ya está actualizado. Ideal para: scroll, animaciones.
  // Cuidado: modificar estado aquí causa otro render.
  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('_log')) {
      // Auto-scroll del log después de que el DOM se actualice
      const logEl = this.shadowRoot?.querySelector('.log');
      if (logEl) {
        logEl.scrollTop = logEl.scrollHeight;
      }
    }
  }

  render() {
    const timeStr = this._time.toLocaleTimeString();

    return html`
      <h3>Ciclo de vida</h3>
      <div class="time">${timeStr}</div>
      <div class="ticks">${this._ticks} ticks</div>

      <div class="log">
        ${this._log.map(entry => {
          const type = entry.includes('connect') ? 'connect'
            : entry.includes('disconnect') ? 'disconnect'
            : entry.includes('first') ? 'first'
            : entry.includes('will') ? 'will'
            : 'did';
          return html`<div class="log-entry ${type}">${entry}</div>`;
        })}
      </div>
    `;
  }
}
