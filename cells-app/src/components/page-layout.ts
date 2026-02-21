import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// ═══════════════════════════════════════════════════════════════
// LAYOUT CON SLOTS — Composición de páginas
//
// Componente wrapper que da estructura a las páginas usando
// slots (rama 09). Cada página proyecta su contenido:
//
//   <page-layout title="Home">
//     <span slot="subtitle">Subtítulo opcional</span>
//     <div>Contenido principal (slot default)</div>
//     <div slot="footer">Pie de página opcional</div>
//   </page-layout>
//
// Comparación:
//   React:    children + props (o Outlet en react-router)
//   Angular:  <ng-content select="[slot]">
//   Vue:      <slot name="header"> template slots
//   Stencil:  <slot name="header"> (idéntico a Lit)
// ═══════════════════════════════════════════════════════════════

@customElement('page-layout')
export class PageLayout extends LitElement {
  @property() pageTitle = '';

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 1.5rem;
    }

    h1 {
      color: #646cff;
      margin: 0 0 0.25rem;
    }

    ::slotted([slot="subtitle"]) {
      color: #888;
      font-size: 0.95rem;
    }

    .content {
      min-height: 200px;
    }

    .footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #333;
    }

    /* Fallback: si no hay footer slot, no se muestra la línea */
    .footer:empty {
      display: none;
    }
  `;

  render() {
    return html`
      <div class="header">
        <h1>${this.pageTitle}</h1>
        <slot name="subtitle"></slot>
      </div>
      <div class="content">
        <slot></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    `;
  }
}
