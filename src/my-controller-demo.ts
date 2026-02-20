import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ClockController } from './controllers/clock-controller.js';
import { MouseController } from './controllers/mouse-controller.js';
import { FetchController } from './controllers/fetch-controller.js';

// ═══════════════════════════════════════════════════════════════
// USANDO CONTROLLERS
//
// Un componente puede tener múltiples controllers.
// Se instancian como propiedades de clase en el constructor
// o directamente como class fields.
//
// Comparación con otros patrones:
//
// Stencil:     No hay equivalente. Usarías servicios/mixins.
// React:       Similar a custom hooks (useEffect, useState combinados)
// Angular:     Similar a servicios inyectados con lifecycle hooks
// Vue:         Similar a Composition API (composables)
// ═══════════════════════════════════════════════════════════════

interface TodoItem {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@customElement('my-controller-demo')
export class MyControllerDemo extends LitElement {
  // Instanciar controllers — se registran automáticamente
  // No hace falta código en connectedCallback/disconnectedCallback
  private _clock = new ClockController(this);
  private _mouse = new MouseController(this);
  private _todos = new FetchController<TodoItem[]>(
    this,
    'https://jsonplaceholder.typicode.com/todos?_limit=5'
  );

  @state()
  private _showClock = true;

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

    .section {
      padding: 0.75rem;
      background: #2a2a3e;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }

    .time {
      font-size: 1.5rem;
      font-weight: bold;
      font-family: monospace;
    }

    .mouse {
      font-family: monospace;
      font-size: 0.9rem;
    }

    .label {
      display: inline-block;
      background: #333;
      padding: 0.1rem 0.4rem;
      border-radius: 3px;
      font-size: 0.7rem;
      color: #aaa;
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

    ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0;
    }

    li {
      padding: 0.3rem 0;
      border-bottom: 1px solid #333;
      font-size: 0.85rem;
    }

    li:last-child { border-bottom: none; }

    .done { text-decoration: line-through; color: #666; }
    .loading { color: #ff9800; font-style: italic; }
    .error { color: #f44336; }

    .code-hint {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #666;
      font-family: monospace;
    }
  `;

  render() {
    return html`
      <h3>Reactive Controllers</h3>

      <!-- ClockController -->
      <h4>ClockController <span class="label">timer con cleanup automático</span></h4>
      <div class="section">
        <div class="time">${this._clock.value.toLocaleTimeString()}</div>
        <div style="font-size: 0.8rem; color: #888;">
          ${this._clock.ticks} ticks
        </div>
        <div class="code-hint">
          private _clock = new ClockController(this);
        </div>
      </div>

      <!-- MouseController -->
      <h4>MouseController <span class="label">event listener global</span></h4>
      <div class="section">
        <div class="mouse">
          x: ${this._mouse.x} | y: ${this._mouse.y}
        </div>
        <div class="code-hint">
          private _mouse = new MouseController(this);
        </div>
      </div>

      <!-- FetchController -->
      <h4>FetchController&lt;T&gt; <span class="label">fetch async con abort</span></h4>
      <div class="section">
        ${this._todos.loading
          ? html`<p class="loading">Cargando...</p>`
          : this._todos.error
            ? html`<p class="error">Error: ${this._todos.error}</p>`
            : html`
                <ul>
                  ${this._todos.data?.map(todo => html`
                    <li class=${todo.completed ? 'done' : ''}>
                      ${todo.completed ? '✓' : '○'} ${todo.title}
                    </li>
                  `)}
                </ul>
              `}
        <button @click=${() => this._todos.fetch()} style="margin-top: 0.5rem;">
          Recargar
        </button>
        <div class="code-hint">
          private _todos = new FetchController&lt;Todo[]&gt;(this, url);
        </div>
      </div>
    `;
  }
}
