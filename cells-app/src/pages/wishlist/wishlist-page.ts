import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { PageController } from '@open-cells/page-controller';
import { navigate } from '@open-cells/core';
import { CartController } from '../../controllers/cart-controller.js';
import { WishlistController } from '../../controllers/wishlist-controller.js';
import { ToastController } from '../../controllers/toast-controller.js';
import { PRODUCTS, Product } from '../../data/products.js';
import '../../components/product-card.js';

@customElement('wishlist-page')
export class WishlistPage extends LitElement {
  pageController = new PageController(this);
  cart = new CartController(this);
  wishlist = new WishlistController(this);
  toast = new ToastController(this);

  private get _wishlistedProducts(): Product[] {
    return PRODUCTS.filter(p => this.wishlist.has(p.id));
  }

  static styles = css`
    :host {
      display: block;
      padding: 2rem 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    h1 {
      color: #646cff;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
    }

    .subtitle {
      color: #888;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    .empty {
      text-align: center;
      padding: 3rem 2rem;
      color: #888;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      fill: #2a2a4a;
      margin-bottom: 1rem;
    }

    .empty h2 {
      margin-bottom: 0.5rem;
      color: #ccc;
      font-size: 1.3rem;
    }

    .empty p {
      margin-bottom: 0.5rem;
    }

    .empty .hint {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 1.5rem;
    }

    .cta-btn {
      background: #646cff;
      color: white;
      border: none;
      padding: 0.7rem 1.8rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-family: inherit;
      font-weight: 600;
      transition: background 0.2s;
    }

    .cta-btn:hover {
      background: #535bf2;
    }

    .cta-btn:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }

    .divider {
      border: none;
      border-top: 1px solid #2a2a4a;
      margin: 3rem 0 2rem;
    }

    .discover h2 {
      color: #ccc;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    @media (max-width: 600px) {
      :host {
        padding: 1rem;
      }

      .grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `;

  render() {
    const wishlisted = this._wishlistedProducts;
    const hasWishlisted = wishlisted.length > 0;

    return html`
      <h1>Favoritos</h1>

      ${when(hasWishlisted,
        () => html`
          <p class="subtitle" aria-live="polite">
            ${wishlisted.length} producto${wishlisted.length !== 1 ? 's' : ''} en tu lista
          </p>
          <div class="grid" role="list" aria-label="Productos favoritos">
            ${repeat(wishlisted, p => p.id, p => html`
              <div role="listitem">
                <product-card
                  productId=${p.id}
                  name=${p.name}
                  .price=${p.price}
                  image=${p.image}
                  category=${p.category}
                  ?wishlisted=${true}
                  @go-to-detail=${(e: CustomEvent) => navigate('product', { id: e.detail.id })}
                  @add-to-cart=${(e: CustomEvent) => this._handleAddToCart(e)}
                  @toggle-wishlist=${(e: CustomEvent) => this._handleToggleWishlist(e)}
                ></product-card>
              </div>
            `)}
          </div>
        `,
        () => html`
          <div class="empty">
            <svg class="empty-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <h2>No tienes favoritos aún</h2>
            <p>Pulsa el corazón en cualquier producto para añadirlo.</p>
            <p class="hint">Mientras tanto, echa un vistazo al catálogo completo:</p>
          </div>

          <div class="discover">
            <h2>Descubre nuestros productos</h2>
            <div class="grid" role="list" aria-label="Catálogo de productos">
              ${repeat(PRODUCTS, p => p.id, p => html`
                <div role="listitem">
                  <product-card
                    productId=${p.id}
                    name=${p.name}
                    .price=${p.price}
                    image=${p.image}
                    category=${p.category}
                    ?wishlisted=${this.wishlist.has(p.id)}
                    @go-to-detail=${(e: CustomEvent) => navigate('product', { id: e.detail.id })}
                    @add-to-cart=${(e: CustomEvent) => this._handleAddToCart(e)}
                    @toggle-wishlist=${(e: CustomEvent) => this._handleToggleWishlist(e)}
                  ></product-card>
                </div>
              `)}
            </div>
          </div>
        `
      )}
    `;
  }

  private _handleAddToCart(e: CustomEvent) {
    this.cart.add(e.detail);
    this.toast.show(`${e.detail.name} añadido al carrito`, 'success');
  }

  private _handleToggleWishlist(e: CustomEvent) {
    const { id, name } = e.detail;
    const wasInWishlist = this.wishlist.has(id);
    this.wishlist.toggle(id);
    this.toast.show(
      wasInWishlist ? `${name} eliminado de favoritos` : `${name} añadido a favoritos`,
      'info'
    );
  }
}
