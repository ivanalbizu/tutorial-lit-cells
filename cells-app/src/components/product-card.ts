import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('product-card')
export class ProductCard extends LitElement {
  @property() productId = '';
  @property() name = '';
  @property({ type: Number }) price = 0;
  @property() image = '';
  @property() category = '';
  @property({ type: Boolean }) wishlisted = false;

  static styles = css`
    :host {
      display: block;
    }

    article {
      background: #16213e;
      border: 1px solid #2a2a4a;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
    }

    article:hover {
      transform: translateY(-4px);
      border-color: #646cff;
      box-shadow: 0 8px 24px rgba(100, 108, 255, 0.15);
    }

    .wish-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      border-radius: 50%;
      width: 2.2rem;
      height: 2.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, transform 0.2s;
      z-index: 1;
    }

    .wish-btn:hover {
      background: rgba(0, 0, 0, 0.7);
      transform: scale(1.1);
    }

    .wish-btn:focus-visible {
      outline: 2px solid #e91e63;
      outline-offset: 2px;
    }

    .wish-btn svg {
      width: 18px;
      height: 18px;
      transition: fill 0.2s;
    }

    .wish-btn.active svg {
      fill: #e91e63;
    }

    .wish-btn:not(.active) svg {
      fill: rgba(255, 255, 255, 0.6);
    }

    .image-link {
      display: block;
      cursor: pointer;
      overflow: hidden;
    }

    .image-link:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: -2px;
    }

    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
      transition: transform 0.3s;
    }

    .image-link:hover .card-image {
      transform: scale(1.05);
    }

    .card-body {
      padding: 1rem;
      flex: 1;
    }

    .category {
      font-size: 0.75rem;
      color: #646cff;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: #e0e0e0;
    }

    .title-link {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      background: none;
      border: none;
      font: inherit;
      padding: 0;
      text-align: left;
    }

    .title-link:hover {
      color: #646cff;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem 1rem;
    }

    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #4caf50;
    }

    .add-btn {
      background: #646cff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      font-family: inherit;
      font-weight: 500;
      transition: background 0.2s, transform 0.1s;
    }

    .add-btn:hover {
      background: #535bf2;
    }

    .add-btn:active {
      transform: scale(0.95);
    }

    .add-btn:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }
  `;

  render() {
    return html`
      <article aria-label="${this.name}, ${this.price.toFixed(2)} euros">
        <button
          class=${classMap({ 'wish-btn': true, 'active': this.wishlisted })}
          @click=${this._toggleWishlist}
          aria-label=${this.wishlisted ? `Quitar ${this.name} de favoritos` : `Añadir ${this.name} a favoritos`}
          aria-pressed=${this.wishlisted ? 'true' : 'false'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
        <div
          class="image-link"
          role="link"
          tabindex="0"
          aria-label="Ver detalle de ${this.name}"
          @click=${this._goToDetail}
          @keydown=${this._handleImageKey}
        >
          <img class="card-image" src=${this.image} alt="" loading="lazy" />
        </div>
        <div class="card-body">
          <div class="category">${this.category}</div>
          <h3>
            <button class="title-link" @click=${this._goToDetail}>${this.name}</button>
          </h3>
        </div>
        <div class="footer">
          <span class="price" aria-label="Precio: ${this.price.toFixed(2)} euros">
            ${this.price.toFixed(2)} &euro;
          </span>
          <button class="add-btn" @click=${this._addToCart} aria-label="Añadir ${this.name} al carrito">
            Añadir
          </button>
        </div>
      </article>
    `;
  }

  private _handleImageKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._goToDetail();
    }
  }

  private _toggleWishlist() {
    this.dispatchEvent(new CustomEvent('toggle-wishlist', {
      detail: { id: this.productId, name: this.name },
      bubbles: true,
      composed: true,
    }));
  }

  private _goToDetail() {
    this.dispatchEvent(new CustomEvent('go-to-detail', {
      detail: { id: this.productId },
      bubbles: true,
      composed: true,
    }));
  }

  private _addToCart() {
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: {
        id: this.productId,
        name: this.name,
        price: this.price,
        image: this.image,
      },
      bubbles: true,
      composed: true,
    }));
  }
}
