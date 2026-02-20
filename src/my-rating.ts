import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// ═══════════════════════════════════════════════════════════════
// EVENTOS: Stencil vs Lit
//
// En Stencil:
//   @Event() ratingChanged: EventEmitter<number>;
//   this.ratingChanged.emit(3);
//
// En Lit no hay decorador @Event. Usas la API nativa del navegador:
//   this.dispatchEvent(new CustomEvent('rating-changed', {
//     detail: 3,
//     bubbles: true,      // sube por el DOM
//     composed: true,     // cruza Shadow DOM boundaries
//   }));
//
// Es más código, pero es API estándar del navegador — sin magia.
// ═══════════════════════════════════════════════════════════════

@customElement('my-rating')
export class MyRating extends LitElement {
  // Puntuación actual (configurable desde fuera)
  @property({ type: Number, reflect: true })
  value = 0;

  // Número máximo de estrellas
  @property({ type: Number })
  max = 5;

  // Si es solo lectura (no emite eventos)
  @property({ type: Boolean, reflect: true })
  readonly = false;

  static styles = css`
    :host {
      display: inline-flex;
      gap: 0.25rem;
    }

    .star {
      cursor: pointer;
      font-size: 1.5rem;
      transition: transform 0.1s;
      user-select: none;
    }

    .star:hover {
      transform: scale(1.2);
    }

    :host([readonly]) .star {
      cursor: default;
    }

    :host([readonly]) .star:hover {
      transform: none;
    }
  `;

  private _select(rating: number) {
    if (this.readonly) return;

    this.value = rating;

    // Emitir evento personalizado (equivalente a @Event() + emit() en Stencil)
    //
    // Opciones importantes:
    //   bubbles: true   → el evento sube por el árbol DOM (como click nativo)
    //   composed: true  → el evento cruza los límites del Shadow DOM
    //                     Sin esto, el padre NO lo vería si usa Shadow DOM
    //   detail          → datos que acompañan al evento (como el payload en Stencil)
    this.dispatchEvent(new CustomEvent('rating-changed', {
      detail: { value: rating },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const stars = [];
    for (let i = 1; i <= this.max; i++) {
      stars.push(html`
        <span
          class="star"
          @click=${() => this._select(i)}
        >${i <= this.value ? '★' : '☆'}</span>
      `);
    }
    return html`${stars}`;
  }
}
