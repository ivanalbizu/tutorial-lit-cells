import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { guard } from 'lit/directives/guard.js';
import { live } from 'lit/directives/live.js';
import { PageController } from '@open-cells/page-controller';
import { navigate } from '@open-cells/core';
import { CartController } from '../../controllers/cart-controller.js';
import { WishlistController } from '../../controllers/wishlist-controller.js';
import { SearchController } from '../../controllers/search-controller.js';
import { ToastController } from '../../controllers/toast-controller.js';
import { PRODUCTS, Product } from '../../data/products.js';
import '../../components/product-card.js';

@customElement('home-page')
export class HomePage extends LitElement {
  pageController = new PageController(this);
  cart = new CartController(this);
  wishlist = new WishlistController(this);
  search = new SearchController(this, 300);
  toast = new ToastController(this);

  @state() private _filter = '';
  @state() private _searchInput = '';

  private get _filteredProducts(): Product[] {
    let result = PRODUCTS;

    if (this._filter) {
      result = result.filter(p =>
        p.category.toLowerCase() === this._filter.toLowerCase()
      );
    }

    if (this.search.query) {
      const q = this.search.query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return result;
  }

  private get _categories(): string[] {
    return [...new Set(PRODUCTS.map(p => p.category))];
  }

  static styles = css`
    :host {
      display: block;
      padding: 2rem 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .hero {
      text-align: center;
      margin-bottom: 2rem;
    }

    .hero h1 {
      font-size: 2.2rem;
      color: #646cff;
      margin-bottom: 0.5rem;
    }

    .hero p {
      color: #999;
      font-size: 1.1rem;
    }

    .search-bar {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      max-width: 500px;
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      background: #16213e;
      border: 1px solid #2a2a4a;
      border-radius: 8px;
      color: #e0e0e0;
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.2s;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23888' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: 0.75rem center;
    }

    .search-input::placeholder {
      color: #666;
    }

    .search-input:focus {
      outline: none;
      border-color: #646cff;
    }

    .filters {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .filters fieldset {
      border: none;
      padding: 0;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .filters legend {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    .filter-btn {
      background: #16213e;
      border: 1px solid #2a2a4a;
      color: #ccc;
      padding: 0.45rem 1.1rem;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.85rem;
      font-family: inherit;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      border-color: #646cff;
      color: white;
    }

    .filter-btn:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }

    .filter-btn[aria-pressed="true"] {
      background: #646cff;
      border-color: #646cff;
      color: white;
    }

    .results-info {
      text-align: center;
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: #888;
    }

    .no-results h2 {
      color: #ccc;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 600px) {
      :host {
        padding: 1rem;
      }

      .hero h1 {
        font-size: 1.6rem;
      }

      .grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `;

  render() {
    const filtered = this._filteredProducts;

    return html`
      <section class="hero">
        <h1>TechShop</h1>
        <p>Los mejores productos de tecnología</p>
      </section>

      <div class="search-bar">
        <input
          class="search-input"
          type="search"
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          .value=${live(this._searchInput)}
          @input=${this._onSearch}
        />
      </div>

      <div class="filters">
        <fieldset>
          <legend>Filtrar por categoría</legend>
          <button
            class="filter-btn"
            aria-pressed=${this._filter === '' ? 'true' : 'false'}
            @click=${() => this._filter = ''}
          >Todos</button>
          ${repeat(this._categories, c => c, c => html`
            <button
              class="filter-btn"
              aria-pressed=${this._filter === c ? 'true' : 'false'}
              @click=${() => this._filter = c}
            >${c}</button>
          `)}
        </fieldset>
      </div>

      <p class="results-info" aria-live="polite">
        ${filtered.length} producto${filtered.length !== 1 ? 's' : ''}${this._filter ? ` en ${this._filter}` : ''}${this.search.query ? ` para "${this.search.query}"` : ''}
      </p>

      ${filtered.length > 0
        ? html`
          <div class="grid" role="list" aria-label="Catálogo de productos">
            ${repeat(filtered, p => p.id, p => html`
              <div role="listitem">
                ${guard([p.id, this.wishlist.has(p.id)], () => html`
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
                `)}
              </div>
            `)}
          </div>
        `
        : html`
          <div class="no-results">
            <h2>Sin resultados</h2>
            <p>No se encontraron productos con esos filtros.</p>
          </div>
        `
      }
    `;
  }

  private _onSearch(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this._searchInput = value;
    this.search.update(value);
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
