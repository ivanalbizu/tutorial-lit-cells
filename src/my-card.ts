import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// ═══════════════════════════════════════════════════════════════
// ESTILOS: Stencil vs Lit
//
// Stencil:
//   @Component({ styleUrl: 'my-card.css' })  → archivo CSS separado
//   @Component({ styles: '...' })             → string inline
//   El compilador inyecta los estilos en el Shadow DOM
//
// Lit:
//   static styles = css`...`                  → CSS con tag css
//   Se inyectan como CSSStyleSheet adoptado (más eficiente)
//   Si hay múltiples instancias, comparten la misma hoja de estilos
// ═══════════════════════════════════════════════════════════════

@customElement('my-card')
export class MyCard extends LitElement {
  @property({ type: String })
  variant: 'default' | 'primary' | 'danger' = 'default';

  @property({ type: String })
  heading = '';

  // ──────────────────────────────────────────
  // static styles — puede ser un solo css`...` o un array
  // ──────────────────────────────────────────
  // Array: útil para compartir estilos base entre componentes
  static styles = [
    // Estilos base (podrían venir de un archivo compartido)
    css`
      /* ═══════════════════════════════════════════
         :host — Estiliza el propio custom element
         En Stencil se usa igual: :host { ... }
         ═══════════════════════════════════════════ */
      :host {
        display: block;
        padding: 1rem;
        border-radius: 8px;
        border: 2px solid var(--card-border-color, #555);
        background: var(--card-bg, #2a2a3e);

        /* CSS custom properties: permiten personalizar
           desde fuera del Shadow DOM (el padre puede setearlas) */
        --card-padding: 1rem;
      }

      /* ═══════════════════════════════════════════
         :host([attr]) — Estiliza según atributo
         Funciona igual en Stencil
         ═══════════════════════════════════════════ */
      :host([variant="primary"]) {
        --card-border-color: #646cff;
        border-color: #646cff;
      }

      :host([variant="danger"]) {
        --card-border-color: #f44336;
        border-color: #f44336;
      }

      /* ═══════════════════════════════════════════
         :host(:hover) — Pseudo-clases en :host
         ═══════════════════════════════════════════ */
      :host(:hover) {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      /* ═══════════════════════════════════════════
         :host-context() — Estiliza según contexto del padre
         Ejemplo: si el body tiene clase .dark-theme
         NOTA: soporte limitado en navegadores
         ═══════════════════════════════════════════ */
    `,
    // Estilos del contenido
    css`
      .header {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--card-border-color, #555);
        color: var(--card-header-color, #c4c4ff);
      }

      /* ═══════════════════════════════════════════
         ::slotted() — Estiliza contenido proyectado en <slot>
         En Stencil se usa igual: ::slotted(p) { ... }
         Solo funciona un nivel (hijos directos del slot)
         ═══════════════════════════════════════════ */
      ::slotted(p) {
        margin: 0.25rem 0;
        line-height: 1.5;
      }

      ::slotted([slot="footer"]) {
        margin-top: 0.75rem;
        padding-top: 0.5rem;
        border-top: 1px solid #333;
        font-size: 0.85rem;
        color: #888;
      }

      /* ═══════════════════════════════════════════
         Estilos internos — encapsulados por Shadow DOM
         No afectan ni se ven afectados por CSS externo
         (mismo comportamiento en Stencil con shadow: true)
         ═══════════════════════════════════════════ */
      .content {
        padding: var(--card-padding);
      }
    `,
  ];

  // ──────────────────────────────────────────
  // ::part() — Exponer partes para estilizar desde fuera
  // En Stencil se usa igual: <div part="header">
  // El padre puede hacer: my-card::part(header) { color: red; }
  // ──────────────────────────────────────────
  render() {
    return html`
      ${this.heading
        ? html`<div class="header" part="header">${this.heading}</div>`
        : ''}
      <div class="content" part="content">
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    `;
  }
}
