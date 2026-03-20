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
      padding: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .hero {
      text-align: center;
      margin-bottom: 2rem;
    }

    .hero h1 {
      font-size: 2rem;
      color: #646cff;
      margin-bottom: 0.5rem;
    }

    .hero p {
      color: #888;
      font-size: 1.1rem;
    }

    .filters {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filters button {
      background: #16213e;
      border: 1px solid #2a2a4a;
      color: #aaa;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .filters button:hover {
      border-color: #646cff;
      color: white;
    }

    .filters button.active {
      background: #646cff;
      border-color: #646cff;
      color: white;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }
  `;

  render() {
    return html`
      <div class="hero">
        <h1>TechShop</h1>
        <p>Los mejores productos de tecnología</p>
      </div>

      <div class="filters">
        <button
          class=${this._filter === '' ? 'active' : ''}
          @click=${() => this._filter = ''}
        >Todos</button>
        ${repeat(this._categories, c => c, c => html`
          <button
            class=${this._filter === c ? 'active' : ''}
            @click=${() => this._filter = c}
          >${c}</button>
        `)}
      </div>

      <div class="grid">
        ${repeat(this._filteredProducts, p => p.id, p => html`
          <product-card
            productId=${p.id}
            name=${p.name}
            .price=${p.price}
            image=${p.image}
            category=${p.category}
            @go-to-detail=${(e: CustomEvent) => navigate('product', { id: e.detail.id })}
            @add-to-cart=${(e: CustomEvent) => this.cart.add(e.detail)}
          ></product-card>
        `)}
      </div>
    `;
  }
}
