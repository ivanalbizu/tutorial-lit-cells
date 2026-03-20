import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { PageController } from '@open-cells/page-controller';
import { navigate } from '@open-cells/core';
import { CartController } from '../../controllers/cart-controller.js';
import { PRODUCTS, Product } from '../../data/products.js';
import '../../components/product-card.js';

@customElement('home-page')
export class HomePage extends LitElement {
  pageController = new PageController(this);
  cart = new CartController(this);

  @state() private _filter = '';

  private get _filteredProducts(): Product[] {
    if (!this._filter) return PRODUCTS;
    return PRODUCTS.filter(p =>
      p.category.toLowerCase() === this._filter.toLowerCase()
    );
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
      margin-bottom: 2.5rem;
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

    .filters {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 2rem;
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
        ${filtered.length} producto${filtered.length !== 1 ? 's' : ''}${this._filter ? ` en ${this._filter}` : ''}
      </p>

      <div class="grid" role="list" aria-label="Catálogo de productos">
        ${repeat(filtered, p => p.id, p => html`
          <div role="listitem">
            <product-card
              productId=${p.id}
              name=${p.name}
              .price=${p.price}
              image=${p.image}
              category=${p.category}
              @go-to-detail=${(e: CustomEvent) => navigate('product', { id: e.detail.id })}
              @add-to-cart=${(e: CustomEvent) => this.cart.add(e.detail)}
            ></product-card>
          </div>
        `)}
      </div>
    `;
  }
}
