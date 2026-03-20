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

    .card {
      background: #16213e;
      border: 1px solid #2a2a4a;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s;
      cursor: pointer;
    }

    .card:hover {
      transform: translateY(-4px);
      border-color: #646cff;
    }

    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }

    .card-body {
      padding: 1rem;
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

    button {
      background: #646cff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: background 0.2s;
    }

    button:hover {
      background: #535bf2;
    }
  `;

  render() {
    return html`
      <div class="card">
        <img
          class="card-image"
          src=${this.image}
          alt=${this.name}
          @click=${this._goToDetail}
        />
        <div class="card-body">
          <div class="category">${this.category}</div>
          <h3 @click=${this._goToDetail}>${this.name}</h3>
        </div>
        <div class="footer">
          <span class="price">${this.price.toFixed(2)} &euro;</span>
          <button @click=${this._addToCart}>Añadir</button>
        </div>
      </div>
    `;
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
