import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { PageController } from '@open-cells/page-controller';
import { navigate } from '@open-cells/core';
import { CartController } from '../../controllers/cart-controller.js';
import { WishlistController } from '../../controllers/wishlist-controller.js';
import { ToastController } from '../../controllers/toast-controller.js';
import { getProductById, Product } from '../../data/products.js';

@customElement('product-page')
export class ProductPage extends LitElement {
  pageController = new PageController(this);
  cart = new CartController(this);
  wishlist = new WishlistController(this);
  toast = new ToastController(this);

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
      padding: 2rem 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .back {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: none;
      border: 1px solid #2a2a4a;
      color: #ccc;
      cursor: pointer;
      font-size: 0.9rem;
      font-family: inherit;
      margin-bottom: 1.5rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .back:hover {
      border-color: #646cff;
      color: white;
    }

    .back:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }

    .back svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .product {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
      align-items: start;
    }

    @media (max-width: 640px) {
      .product {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    .image-wrapper {
      position: relative;
    }

    .product img {
      width: 100%;
      border-radius: 12px;
      object-fit: cover;
      aspect-ratio: 4/3;
    }

    .wish-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, transform 0.2s;
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
      width: 20px;
      height: 20px;
      transition: fill 0.2s;
    }

    .wish-btn.active svg {
      fill: #e91e63;
    }

    .wish-btn:not(.active) svg {
      fill: rgba(255, 255, 255, 0.6);
    }

    .details h1 {
      font-size: 1.8rem;
      color: #e0e0e0;
      margin-bottom: 0.25rem;
    }

    .category {
      display: inline-block;
      color: #646cff;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      background: rgba(100, 108, 255, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
    }

    .description {
      color: #aaa;
      line-height: 1.7;
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
      flex-wrap: wrap;
    }

    .add-btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
    }

    .add-btn:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }

    .add-btn:active {
      transform: scale(0.96);
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
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Volver al catálogo
      </button>

      ${when(this._product,
        () => this._renderProduct(),
        () => html`
          <div class="not-found" role="alert">
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
    const isWished = this.wishlist.has(p.id);

    return html`
      <div class="product">
        <div class="image-wrapper">
          <img src=${p.image} alt="Imagen de ${p.name}" />
          <button
            class=${classMap({ 'wish-btn': true, 'active': isWished })}
            @click=${this._toggleWishlist}
            aria-label=${isWished ? `Quitar ${p.name} de favoritos` : `Añadir ${p.name} a favoritos`}
            aria-pressed=${isWished ? 'true' : 'false'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
        <div class="details">
          <span class="category">${p.category}</span>
          <h1>${p.name}</h1>
          <p class="description">${p.description}</p>
          <div class="price" aria-label="Precio: ${p.price.toFixed(2)} euros">
            ${p.price.toFixed(2)} &euro;
          </div>
          <div class="actions">
            <button
              class=${classMap({
                'add-btn': true,
                'default': !this._justAdded,
                'added': this._justAdded,
              })}
              @click=${this._addToCart}
              aria-label=${this._justAdded ? `${p.name} añadido al carrito` : `Añadir ${p.name} al carrito`}
            >
              ${this._justAdded ? 'Añadido ✓' : 'Añadir al carrito'}
            </button>
            ${when(inCart, () => html`
              <span class="in-cart-info" aria-live="polite">
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
    this.toast.show(`${this._product.name} añadido al carrito`, 'success');
    setTimeout(() => { this._justAdded = false; }, 1500);
  }

  private _toggleWishlist() {
    if (!this._product) return;
    const wasWished = this.wishlist.has(this._product.id);
    this.wishlist.toggle(this._product.id);
    this.toast.show(
      wasWished
        ? `${this._product.name} eliminado de favoritos`
        : `${this._product.name} añadido a favoritos`,
      'info'
    );
  }
}
