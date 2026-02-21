import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { PageController } from '@open-cells/page-controller';
import { CartController } from '../../controllers/cart-controller.js';
import '../../components/page-layout.js';

// ═══════════════════════════════════════════════════════════════
// PÁGINA PRODUCTO — Proyecto final
//
// Integra conceptos de todo el tutorial:
//   - PageController (rama 13) — lifecycle y navegación
//   - CartController (Reactive Controller, rama 10) — lógica del carrito
//   - Directivas when, classMap (rama 08) — renderizado condicional
//   - page-layout con slots (rama 09) — composición
//   - Params dinámicos (rama 14) — :id en la URL
//   - Channels pub/sub (rama 15) — via CartController
// ═══════════════════════════════════════════════════════════════

const PRODUCTS: Record<string, { name: string; price: number; description: string; category: string }> = {
  '1': { name: 'Teclado mecánico', price: 89.99, description: 'Switches Cherry MX Blue, retroiluminado RGB', category: 'periféricos' },
  '2': { name: 'Monitor 4K', price: 349.99, description: 'Panel IPS 27", 144Hz, HDR', category: 'pantallas' },
  '3': { name: 'Ratón ergonómico', price: 49.99, description: 'Sensor óptico 16000 DPI, 7 botones', category: 'periféricos' },
};

@customElement('product-page')
export class ProductPage extends LitElement {
  pageController = new PageController(this);

  // CartController: Reactive Controller que encapsula la lógica del carrito
  // Se suscribe/desuscribe al canal automáticamente via hostConnected/Disconnected
  cart = new CartController(this);

  @state() private _productId = '';
  @state() private _product: (typeof PRODUCTS)[string] | null = null;
  @state() private _justAdded = false;

  static styles = css`
    :host { display: block; }

    .breadcrumb {
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }

    .breadcrumb button {
      background: none;
      border: none;
      color: #646cff;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0;
    }

    .breadcrumb button:hover { text-decoration: underline; }

    .product-card {
      padding: 1.5rem;
      background: #2a2a3e;
      border-radius: 8px;
      border: 1px solid #333;
      transition: border-color 0.2s;
    }

    .product-card.in-cart { border-color: #4caf50; }

    .product-card h2 {
      color: #c4c4ff;
      margin: 0 0 0.5rem;
    }

    .category {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      background: #1a1a2e;
      border-radius: 12px;
      font-size: 0.75rem;
      color: #888;
      margin-bottom: 0.75rem;
    }

    .price {
      font-size: 1.5rem;
      color: #4caf50;
      font-weight: bold;
      margin-bottom: 0.75rem;
    }

    .description { color: #aaa; line-height: 1.6; }

    .actions { margin-top: 1rem; display: flex; gap: 0.5rem; align-items: center; }

    button {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
      color: white;
    }

    .btn-cart { background: #4caf50; padding: 0.5rem 1rem; font-size: 0.9rem; }
    .btn-cart:hover { background: #388e3c; }
    .btn-nav { background: #646cff; }
    .btn-nav:hover { background: #535bf2; }

    .added-msg { color: #4caf50; font-size: 0.85rem; }

    .nav-buttons { margin-top: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }

    .not-found {
      padding: 2rem;
      text-align: center;
      color: #f44336;
    }
  `;

  onPageEnter() {
    this._readParams();
    this._justAdded = false;
  }

  private _readParams() {
    const hash = window.location.hash;
    const match = hash.match(/\/product\/(\w+)/);
    if (match) {
      this._productId = match[1];
      this._product = PRODUCTS[this._productId] || null;
    }
  }

  private _addToCart() {
    if (!this._product) return;
    this.cart.add({
      id: this._productId,
      name: this._product.name,
      price: this._product.price,
    });
    this._justAdded = true;
    setTimeout(() => { this._justAdded = false; }, 2000);
  }

  render() {
    // when() — directiva condicional lazy (rama 08)
    return when(
      this._product,
      () => this._renderProduct(),
      () => this._renderNotFound()
    );
  }

  private _renderNotFound() {
    return html`
      <page-layout pageTitle="Producto no encontrado">
        <div class="not-found">
          <p>ID: ${this._productId}</p>
          <button class="btn-nav" @click=${() => this.pageController.navigate('home')}>
            Volver a Home
          </button>
        </div>
      </page-layout>
    `;
  }

  private _renderProduct() {
    // classMap() — clases condicionales (rama 08)
    const isInCart = this.cart.items.some(item => item.id === this._productId);
    const cardClasses = classMap({
      'product-card': true,
      'in-cart': isInCart,
    });

    return html`
      <page-layout pageTitle="Producto ${this._productId}">
        <span slot="subtitle">${this._product!.category}</span>

        <div class="breadcrumb">
          <button @click=${() => this.pageController.navigate('home')}>Home</button>
          → Producto ${this._productId}
        </div>

        <div class=${cardClasses}>
          <h2>${this._product!.name}</h2>
          <span class="category">${this._product!.category}</span>
          <div class="price">${this._product!.price.toFixed(2)} &euro;</div>
          <p class="description">${this._product!.description}</p>

          <div class="actions">
            <button class="btn-cart" @click=${this._addToCart}>
              Añadir al carrito
            </button>
            ${when(this._justAdded, () => html`
              <span class="added-msg">Añadido</span>
            `)}
            ${when(isInCart, () => html`
              <button class="btn-nav"
                @click=${() => this.pageController.navigate('cart')}>
                Ver carrito (${this.cart.count})
              </button>
            `)}
          </div>
        </div>

        <div class="nav-buttons">
          ${Object.keys(PRODUCTS)
            .filter(id => id !== this._productId)
            .map(id => html`
              <button class="btn-nav"
                @click=${() => this.pageController.navigate('product', { id })}>
                ${PRODUCTS[id].name}
              </button>
            `)}
        </div>
      </page-layout>
    `;
  }
}
