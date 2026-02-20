import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

/**
 * Componente que demuestra templates y binding en Lit:
 *
 * 1. Interpolación de texto:       ${expresion}
 * 2. Binding de atributo:          attr=${valor}
 * 3. Binding de propiedad:         .prop=${valor}
 * 4. Binding de evento:            @event=${handler}
 * 5. Binding booleano:             ?attr=${bool}
 * 6. Condicionales:                ternario o nothing
 * 7. Listas:                       .map()
 *
 * En Stencil todo esto se hace con JSX. En Lit con tagged templates.
 */
@customElement('my-task-list')
export class MyTaskList extends LitElement {
  @property({ type: String })
  title = 'Mis tareas';

  @state()
  private _tasks: Task[] = [
    { id: 1, text: 'Aprender Lit', done: true },
    { id: 2, text: 'Crear componentes', done: false },
    { id: 3, text: 'Dominar templates', done: false },
  ];

  @state()
  private _newTaskText = '';

  @state()
  private _filter: 'all' | 'pending' | 'done' = 'all';

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #646cff;
      border-radius: 8px;
      max-width: 450px;
    }

    h3 { margin: 0 0 0.75rem; color: #c4c4ff; }

    .input-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    input[type="text"] {
      flex: 1;
      padding: 0.4rem 0.6rem;
      border: 1px solid #555;
      border-radius: 4px;
      background: #2a2a3e;
      color: #eee;
    }

    button {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
    }

    button:hover { background: #535bf2; }
    button:disabled { opacity: 0.4; cursor: default; }

    .filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .filters button {
      background: #333;
      font-size: 0.8rem;
    }

    .filters button[active] {
      background: #646cff;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0;
      border-bottom: 1px solid #333;
    }

    li:last-child { border-bottom: none; }

    .done { text-decoration: line-through; color: #888; }

    .count {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #888;
    }

    .empty {
      color: #666;
      font-style: italic;
      padding: 0.5rem 0;
    }
  `;

  private _addTask() {
    const text = this._newTaskText.trim();
    if (!text) return;

    // En Lit, para disparar reactividad en arrays/objetos,
    // debes reasignar la referencia (igual que en Stencil con @State)
    this._tasks = [
      ...this._tasks,
      { id: Date.now(), text, done: false },
    ];
    this._newTaskText = '';
  }

  private _toggleTask(id: number) {
    this._tasks = this._tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );
  }

  private _removeTask(id: number) {
    this._tasks = this._tasks.filter(t => t.id !== id);
  }

  private _onInput(e: InputEvent) {
    this._newTaskText = (e.target as HTMLInputElement).value;
  }

  private _onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') this._addTask();
  }

  private get _filteredTasks(): Task[] {
    switch (this._filter) {
      case 'pending': return this._tasks.filter(t => !t.done);
      case 'done': return this._tasks.filter(t => t.done);
      default: return this._tasks;
    }
  }

  render() {
    const pending = this._tasks.filter(t => !t.done).length;
    const filtered = this._filteredTasks;

    return html`
      <h3>${this.title}</h3>

      <!-- ═══════════════════════════════════════════════
           1. BINDING DE EVENTO: @input, @click, @keydown
           En Stencil (JSX): onInput={...} onClick={...}
           En Lit:           @input=${...} @click=${...}
           ═══════════════════════════════════════════════ -->
      <div class="input-row">
        <input
          type="text"
          placeholder="Nueva tarea..."
          .value=${this._newTaskText}
          @input=${this._onInput}
          @keydown=${this._onKeydown}
        />
        <!-- ═══════════════════════════════════════════════
             5. BINDING BOOLEANO: ?disabled=${condición}
             En Stencil (JSX): disabled={!this.text}
             En Lit:           ?disabled=${!this.text}
             El prefijo ? añade/quita el atributo booleano
             ═══════════════════════════════════════════════ -->
        <button
          ?disabled=${!this._newTaskText.trim()}
          @click=${this._addTask}
        >
          Añadir
        </button>
      </div>

      <!-- ═══════════════════════════════════════════════
           2. BINDING DE ATRIBUTO: attr=${valor}
           ?active es un booleano: presente si true
           ═══════════════════════════════════════════════ -->
      <div class="filters">
        <button
          ?active=${this._filter === 'all'}
          @click=${() => this._filter = 'all'}
        >Todas</button>
        <button
          ?active=${this._filter === 'pending'}
          @click=${() => this._filter = 'pending'}
        >Pendientes (${pending})</button>
        <button
          ?active=${this._filter === 'done'}
          @click=${() => this._filter = 'done'}
        >Hechas (${this._tasks.length - pending})</button>
      </div>

      <!-- ═══════════════════════════════════════════════
           6. CONDICIONALES
           Opción A: ternario      → condicion ? html`...` : html`...`
           Opción B: con nothing   → condicion ? html`...` : nothing
           "nothing" es un símbolo de Lit que no renderiza nada
           (más limpio que '' o null)

           En Stencil se usa el mismo ternario pero en JSX
           ═══════════════════════════════════════════════ -->
      ${filtered.length === 0
        ? html`<p class="empty">No hay tareas ${this._filter !== 'all' ? 'en este filtro' : nothing}</p>`
        : nothing}

      <!-- ═══════════════════════════════════════════════
           7. LISTAS: .map() sobre un array
           En Stencil: {this.items.map(item => <li>...</li>)}
           En Lit:     ${this.items.map(item => html`<li>...</li>`)}
           ═══════════════════════════════════════════════ -->
      <ul>
        ${filtered.map(task => html`
          <li>
            <input
              type="checkbox"
              .checked=${task.done}
              @change=${() => this._toggleTask(task.id)}
            />
            <!-- ═══════════════════════════════════════
                 Clase condicional con ternario
                 En Stencil: class={{ done: task.done }}
                 En Lit: class=${task.done ? 'done' : ''}
                 (en la próxima rama veremos classMap)
                 ═══════════════════════════════════════ -->
            <span class=${task.done ? 'done' : ''}>${task.text}</span>
            <button @click=${() => this._removeTask(task.id)}>✕</button>
          </li>
        `)}
      </ul>

      <!-- ═══════════════════════════════════
           1. INTERPOLACIÓN DE TEXTO: ${expr}
           Igual que en Stencil: {expr}
           ═══════════════════════════════════ -->
      <div class="count">
        ${this._tasks.length} tareas | ${pending} pendientes
      </div>
    `;
  }
}
