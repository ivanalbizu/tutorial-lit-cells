import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './my-rating.js';

// ═══════════════════════════════════════════════════════════════
// ESCUCHAR EVENTOS: Stencil vs Lit
//
// En Stencil:
//   Opción A: @Listen('ratingChanged')
//             handleRating(e: CustomEvent<number>) { ... }
//
//   Opción B: En JSX: <my-rating onRatingChanged={e => ...} />
//
// En Lit:
//   En el template: @rating-changed=${this._onRatingChanged}
//
// Nota sobre nombres de eventos:
//   - Stencil: camelCase (ratingChanged) → se convierte a kebab-case en el DOM
//   - Lit: usas directamente kebab-case (rating-changed) porque es API nativa
// ═══════════════════════════════════════════════════════════════

interface Review {
  product: string;
  rating: number;
  comment: string;
}

@customElement('my-review')
export class MyReview extends LitElement {
  @state()
  private _currentRating = 0;

  @state()
  private _comment = '';

  @state()
  private _reviews: Review[] = [];

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      border: 2px solid #646cff;
      border-radius: 8px;
      max-width: 450px;
    }

    h3 { margin: 0 0 0.75rem; color: #c4c4ff; }

    .form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
      color: #aaa;
    }

    textarea {
      padding: 0.4rem;
      border: 1px solid #555;
      border-radius: 4px;
      background: #2a2a3e;
      color: #eee;
      resize: vertical;
      min-height: 60px;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
      align-self: flex-start;
    }

    button:hover { background: #535bf2; }
    button:disabled { opacity: 0.4; cursor: default; }

    .review-list {
      border-top: 1px solid #333;
      padding-top: 0.75rem;
    }

    .review-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid #222;
    }

    .review-item:last-child { border-bottom: none; }

    .review-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .review-comment {
      margin-top: 0.25rem;
      font-size: 0.9rem;
      color: #aaa;
    }

    .empty {
      color: #666;
      font-style: italic;
    }
  `;

  // Escuchar el CustomEvent del hijo <my-rating>
  // El evento llega con e.detail.value gracias a bubbles + composed
  private _onRatingChanged(e: CustomEvent<{ value: number }>) {
    this._currentRating = e.detail.value;
  }

  private _onCommentInput(e: InputEvent) {
    this._comment = (e.target as HTMLTextAreaElement).value;
  }

  private _submitReview() {
    if (this._currentRating === 0) return;

    this._reviews = [
      ...this._reviews,
      {
        product: 'Lit Framework',
        rating: this._currentRating,
        comment: this._comment,
      },
    ];

    // Reset del formulario
    this._currentRating = 0;
    this._comment = '';

    // Emitir evento hacia arriba (el padre de my-review podría escucharlo)
    this.dispatchEvent(new CustomEvent('review-submitted', {
      detail: { total: this._reviews.length },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <h3>Deja tu review</h3>

      <div class="form">
        <label>
          Puntuación
          <!-- Escuchar evento del hijo con @nombre-evento -->
          <my-rating
            .value=${this._currentRating}
            @rating-changed=${this._onRatingChanged}
          ></my-rating>
        </label>

        <label>
          Comentario
          <textarea
            .value=${this._comment}
            @input=${this._onCommentInput}
            placeholder="Escribe tu opinión..."
          ></textarea>
        </label>

        <button
          ?disabled=${this._currentRating === 0}
          @click=${this._submitReview}
        >
          Enviar review
        </button>
      </div>

      ${this._reviews.length > 0
        ? html`
            <div class="review-list">
              <h4>Reviews (${this._reviews.length})</h4>
              ${this._reviews.map(r => html`
                <div class="review-item">
                  <div class="review-header">
                    <my-rating .value=${r.rating} readonly></my-rating>
                    <span>${r.product}</span>
                  </div>
                  ${r.comment
                    ? html`<div class="review-comment">${r.comment}</div>`
                    : nothing}
                </div>
              `)}
            </div>
          `
        : html`<p class="empty">No hay reviews aún</p>`}
    `;
  }
}
