import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('product-card')
export class ProductCard extends LitElement {
  @property() productId = '';
  @property() name = '';
  @property({ type: Number }) price = 0;
  @property() image = '';
  @property() category = '';

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
    }

    article:hover {
      transform: translateY(-4px);
      border-color: #646cff;
      box-shadow: 0 8px 24px rgba(100, 108, 255, 0.15);
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
        <div
          class="image-link"
          role="link"
          tabindex="0"
          aria-label="Ver detalle de ${this.name}"
          @click=${this._goToDetail}
          @keydown=${this._handleImageKey}
        >
          <img
            class="card-image"
            src=${this.image}
            alt=""
            loading="lazy"
          />
        </div>
        <div class="card-body">
          <div class="category">${this.category}</div>
          <h3>
            <button class="title-link" @click=${this._goToDetail}>
              ${this.name}
            </button>
          </h3>
        </div>
        <div class="footer">
          <span class="price" aria-label="Precio: ${this.price.toFixed(2)} euros">
            ${this.price.toFixed(2)} &euro;
          </span>
          <button
            class="add-btn"
            @click=${this._addToCart}
            aria-label="Añadir ${this.name} al carrito"
          >Añadir</button>
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
