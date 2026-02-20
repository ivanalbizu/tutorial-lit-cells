import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import { guard } from 'lit/directives/guard.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';

// ═══════════════════════════════════════════════════════════════
// DIRECTIVAS en Lit
//
// Stencil no tiene concepto de "directivas" porque usa JSX,
// donde todo es JavaScript nativo (ternarios, .map(), objetos
// de clases, etc.).
//
// En Lit, las directivas son funciones que se usan dentro de
// html`...` para controlar cómo se renderizan las expresiones.
// Son el equivalente Lit a los patrones comunes de JSX.
// ═══════════════════════════════════════════════════════════════

interface Person {
  id: number;
  name: string;
  role: 'admin' | 'user' | 'guest';
  online: boolean;
  avatar?: string;
}

@customElement('my-directive-demo')
export class MyDirectiveDemo extends LitElement {
  @state()
  private _people: Person[] = [
    { id: 1, name: 'Ana', role: 'admin', online: true },
    { id: 2, name: 'Carlos', role: 'user', online: false },
    { id: 3, name: 'Elena', role: 'user', online: true },
    { id: 4, name: 'David', role: 'guest', online: false, avatar: 'https://i.pravatar.cc/32?u=david' },
  ];

  @state()
  private _selectedId: number | null = null;

  @state()
  private _sortAsc = true;

  @state()
  private _filterRole: 'all' | 'admin' | 'user' | 'guest' = 'all';

  @state()
  private _editName = '';

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #646cff;
      border-radius: 8px;
      max-width: 550px;
    }

    h3 { margin: 0 0 0.75rem; color: #c4c4ff; }
    h4 { margin: 0.75rem 0 0.5rem; color: #aaa; font-size: 0.85rem; }

    .controls {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
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
    button.active { background: #4caf50; }
    button.secondary { background: #555; }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border-bottom: 1px solid #333;
      cursor: pointer;
      transition: background 0.15s;
    }

    li:hover { background: rgba(255,255,255,0.05); }
    li:last-child { border-bottom: none; }

    /* Clases para classMap */
    .selected { background: rgba(100, 108, 255, 0.2) !important; }
    .online { color: #4caf50; }
    .offline { color: #888; }
    .admin-badge { color: #ff9800; font-weight: bold; }
    .guest-badge { color: #666; font-style: italic; }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }

    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #555;
    }

    .detail {
      margin-top: 0.5rem;
      padding: 0.75rem;
      background: #2a2a3e;
      border-radius: 4px;
    }

    input[type="text"] {
      padding: 0.3rem 0.5rem;
      border: 1px solid #555;
      border-radius: 4px;
      background: #2a2a3e;
      color: #eee;
    }

    .directive-label {
      display: inline-block;
      background: #333;
      padding: 0.1rem 0.4rem;
      border-radius: 3px;
      font-size: 0.7rem;
      color: #aaa;
      margin-left: 0.25rem;
    }

    .computed-info {
      font-size: 0.8rem;
      color: #888;
      margin-top: 0.5rem;
    }
  `;

  private get _filteredPeople(): Person[] {
    let result = this._people;
    if (this._filterRole !== 'all') {
      result = result.filter(p => p.role === this._filterRole);
    }
    return [...result].sort((a, b) =>
      this._sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }

  private _shuffle() {
    this._people = [...this._people].sort(() => Math.random() - 0.5);
  }

  private _addPerson() {
    const names = ['Marta', 'Pablo', 'Laura', 'Jorge', 'Sofía', 'Luis'];
    const roles: Array<'admin' | 'user' | 'guest'> = ['admin', 'user', 'guest'];
    this._people = [
      ...this._people,
      {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
        online: Math.random() > 0.5,
      },
    ];
  }

  private _removePerson(id: number) {
    this._people = this._people.filter(p => p.id !== id);
    if (this._selectedId === id) this._selectedId = null;
  }

  private _select(id: number) {
    this._selectedId = this._selectedId === id ? null : id;
    const person = this._people.find(p => p.id === id);
    this._editName = person?.name ?? '';
  }

  private _updateName() {
    if (!this._selectedId || !this._editName.trim()) return;
    this._people = this._people.map(p =>
      p.id === this._selectedId ? { ...p, name: this._editName.trim() } : p
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DIRECTIVAS USADAS EN ESTE RENDER (ver README para detalles):
  //
  // repeat(items, keyFn, tplFn) — Lista con keys (= key={id} en JSX)
  // classMap({ clase: bool })   — Clases condicionales (= class={{ ... }} en JSX)
  // styleMap({ prop: val })     — Estilos inline (= style={{ ... }} en JSX)
  // ifDefined(val)              — Atributo opcional (no se añade si undefined)
  // when(cond, trueFn, falseFn) — Condicional legible y lazy
  // live(val)                   — Compara con valor real del DOM
  // guard([deps], fn)           — Memoización (solo re-evalúa si deps cambian)
  // ═══════════════════════════════════════════════════════════════
  render() {
    const filtered = this._filteredPeople;
    const selected = this._people.find(p => p.id === this._selectedId);

    return html`
      <h3>Directivas de Lit</h3>

      <div class="controls">
        <button @click=${this._shuffle}>Reordenar</button>
        <button @click=${this._addPerson}>+ Persona</button>
        <button @click=${() => this._sortAsc = !this._sortAsc}>
          Orden: ${this._sortAsc ? 'A→Z' : 'Z→A'}
        </button>
        <button
          class=${this._filterRole === 'all' ? 'active' : 'secondary'}
          @click=${() => this._filterRole = 'all'}
        >Todos</button>
        <button
          class=${this._filterRole === 'admin' ? 'active' : 'secondary'}
          @click=${() => this._filterRole = 'admin'}
        >Admin</button>
        <button
          class=${this._filterRole === 'user' ? 'active' : 'secondary'}
          @click=${() => this._filterRole = 'user'}
        >User</button>
      </div>

      <!-- repeat() — lista con keys -->
      <h4>repeat() <span class="directive-label">lista con keys</span></h4>
      <ul>
        ${repeat(
          filtered,
          (p) => p.id,
          (p) => html`
            <li
              class=${classMap({ selected: p.id === this._selectedId })}
              @click=${() => this._select(p.id)}
            >
              <!-- styleMap() — estilos inline -->
              <span
                class="status-dot"
                style=${styleMap({ backgroundColor: p.online ? '#4caf50' : '#666' })}
              ></span>

              <!-- ifDefined() — atributo opcional -->
              <img
                class="avatar"
                src=${ifDefined(p.avatar)}
                alt=${ifDefined(p.avatar ? p.name : undefined)}
              />

              <!-- classMap() — clases condicionales -->
              <span class=${classMap({
                'online': p.online,
                'offline': !p.online,
                'admin-badge': p.role === 'admin',
                'guest-badge': p.role === 'guest',
              })}>
                ${p.name} (${p.role})
              </span>

              <button @click=${(e: Event) => { e.stopPropagation(); this._removePerson(p.id); }}>✕</button>
            </li>
          `
        )}
      </ul>

      <!-- when() — condicional -->
      <h4>when() <span class="directive-label">condicional</span></h4>
      ${when(
        selected,
        () => html`
          <div class="detail">
            <p>Editando: <strong>${selected!.name}</strong></p>
            <!-- live() — sincroniza con valor real del DOM -->
            <input
              type="text"
              .value=${live(this._editName)}
              @input=${(e: InputEvent) => this._editName = (e.target as HTMLInputElement).value}
            />
            <button @click=${this._updateName}>Guardar</button>
          </div>
        `,
        () => html`<p style="color:#666; font-style:italic;">Haz click en una persona para editarla</p>`
      )}

      <!-- guard() — memoización -->
      <h4>guard() <span class="directive-label">memoización</span></h4>
      ${guard([this._people], () => {
        const stats = {
          total: this._people.length,
          online: this._people.filter(p => p.online).length,
          admins: this._people.filter(p => p.role === 'admin').length,
        };
        return html`
          <div class="computed-info">
            Estadísticas (solo se recalculan si cambia _people):
            ${stats.total} personas | ${stats.online} online | ${stats.admins} admins
          </div>
        `;
      })}
    `;
  }
}
