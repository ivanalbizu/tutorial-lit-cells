import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { PageController } from '@open-cells/page-controller';
import { navigate } from '@open-cells/core';
import { CartController } from '../../controllers/cart-controller.js';
import { getProductById, Product } from '../../data/products.js';

@customElement('product-page')
export class ProductPage extends LitElement {
  pageController = new PageController(this);
  cart = new CartController(this);

  @state() private _product: Product | undefined;
  @state() private _justAdded = false;

  onPageEnter() {
    const hash = window.location.hash;
    const parts = hash.replace('#!/', '').split('/');
    const id = parts[1] || '1';
    this._product = getProductById(id);
    this._justAdded = false;
  }

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .back {
      background: none;
      border: none;
      color: #646cff;
      cursor: pointer;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      padding: 0;
    }

    .back:hover {
      text-decoration: underline;
    }

    .product {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    @media (max-width: 640px) {
      .product {
        grid-template-columns: 1fr;
      }
    }

    .product img {
      width: 100%;
      border-radius: 12px;
      object-fit: cover;
      aspect-ratio: 4/3;
    }

    .details h1 {
      font-size: 1.8rem;
      color: #e0e0e0;
      margin-bottom: 0.25rem;
    }

    .category {
      color: #646cff;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }

    .description {
      color: #aaa;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #4caf50;
      margin-bottom: 1.5rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .add-btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
    }

    .add-btn.default {
      background: #646cff;
      color: white;
    }

    .add-btn.default:hover {
      background: #535bf2;
    }

    .add-btn.added {
      background: #4caf50;
      color: white;
    }

    .in-cart-info {
      color: #4caf50;
      font-size: 0.9rem;
    }

    .not-found {
      text-align: center;
      padding: 3rem;
      color: #888;
    }

    .not-found h2 {
      color: #e63946;
      margin-bottom: 0.5rem;
    }
  `;

  render() {
    return html`
      <button class="back" @click=${() => navigate('home')}>
        &larr; Volver al catálogo
      </button>

      ${when(this._product,
        () => this._renderProduct(),
        () => html`
          <div class="not-found">
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe.</p>
          </div>
        `
      )}
    `;
  }

  private _renderProduct() {
    const p = this._product!;
    const inCart = this.cart.items.some(i => i.id === p.id);
    const cartItem = this.cart.items.find(i => i.id === p.id);

    return html`
      <div class="product">
        <img src=${p.image} alt=${p.name} />
        <div class="details">
          <div class="category">${p.category}</div>
          <h1>${p.name}</h1>
          <p class="description">${p.description}</p>
          <div class="price">${p.price.toFixed(2)} &euro;</div>
          <div class="actions">
            <button
              class=${classMap({
                'add-btn': true,
                'default': !this._justAdded,
                'added': this._justAdded,
              })}
              @click=${this._addToCart}
            >
              ${this._justAdded ? 'Añadido' : 'Añadir al carrito'}
            </button>
            ${when(inCart, () => html`
              <span class="in-cart-info">
                ${cartItem!.quantity} en el carrito
              </span>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  private _addToCart() {
    if (!this._product) return;
    this.cart.add({
      id: this._product.id,
      name: this._product.name,
      price: this._product.price,
      image: this._product.image,
    });
    this._justAdded = true;
    setTimeout(() => { this._justAdded = false; }, 1500);
  }
}
