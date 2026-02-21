import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';

// ═══════════════════════════════════════════════════════════════
// PÁGINA PRODUCTO — Ahora con publish al carrito
//
// Además de parámetros dinámicos, esta página usa
// pageController.publish() para añadir productos al carrito.
//
// El canal 'ch-cart' es escuchado por cart-page.
// Cualquier componente puede publicar en el mismo canal.
//
// publish(channel, data) envía data a TODOS los suscriptores.
// ═══════════════════════════════════════════════════════════════

// Datos simulados de productos
const PRODUCTS: Record<string, { name: string; price: number; description: string }> = {
  '1': { name: 'Teclado mecánico', price: 89.99, description: 'Switches Cherry MX Blue, retroiluminado RGB' },
  '2': { name: 'Monitor 4K', price: 349.99, description: 'Panel IPS 27", 144Hz, HDR' },
  '3': { name: 'Ratón ergonómico', price: 49.99, description: 'Sensor óptico 16000 DPI, 7 botones' },
};

@customElement('product-page')
export class ProductPage extends LitElement {
  pageController = new PageController(this);

  @state()
  private _productId = '';

  @state()
  private _product: { name: string; price: number; description: string } | null = null;

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 { color: #646cff; margin-bottom: 0.5rem; }

    .breadcrumb {
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
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
    }

    .product-card h2 {
      color: #c4c4ff;
      margin: 0 0 0.5rem;
    }

    .price {
      font-size: 1.5rem;
      color: #4caf50;
      font-weight: bold;
      margin-bottom: 0.75rem;
    }

    .description {
      color: #aaa;
      line-height: 1.6;
    }

    .not-found {
      padding: 2rem;
      text-align: center;
      color: #f44336;
    }

    .param-info {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #1a1a2e;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
      color: #888;
    }

    .param-info code {
      color: #4caf50;
    }

    .nav-buttons {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    button.nav {
      padding: 0.4rem 0.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
      font-size: 0.85rem;
    }

    button.nav:hover { background: #535bf2; }
    button.add-cart {
      background: #4caf50;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
    button.add-cart:hover { background: #388e3c; }

    .added-msg {
      color: #4caf50;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
  `;

  @state()
  private _cart: Array<{ id: string; name: string; price: number; quantity: number }> = [];

  @state()
  private _justAdded = false;

  onPageEnter() {
    this._readParams();
    this._justAdded = false;

    // Suscribirse al carrito para tener el estado actual
    this.pageController.subscribe('ch-cart', (items: typeof this._cart) => {
      this._cart = [...items];
    });
  }

  onPageLeave() {
    this.pageController.unsubscribe('ch-cart');
  }

  private _addToCart() {
    if (!this._product) return;

    const existing = this._cart.find(item => item.id === this._productId);
    let updated;
    if (existing) {
      updated = this._cart.map(item =>
        item.id === this._productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...this._cart, {
        id: this._productId,
        name: this._product.name,
        price: this._product.price,
        quantity: 1,
      }];
    }

    // Publicar el nuevo estado del carrito
    this.pageController.publish('ch-cart', updated);
    this._justAdded = true;
    setTimeout(() => { this._justAdded = false; }, 2000);
  }

  private _readParams() {
    const hash = window.location.hash; // #!/product/2
    const match = hash.match(/\/product\/(\w+)/);
    if (match) {
      this._productId = match[1];
      this._product = PRODUCTS[this._productId] || null;
    }
  }

  render() {
    if (!this._product) {
      return html`
        <div class="not-found">
          <h1>Producto no encontrado</h1>
          <p>ID: ${this._productId}</p>
          <button class="nav" @click=${() => this.pageController.navigate('home')}>
            Volver a Home
          </button>
        </div>
      `;
    }

    return html`
      <div class="breadcrumb">
        <button @click=${() => this.pageController.navigate('home')}>Home</button>
        → Producto ${this._productId}
      </div>

      <div class="product-card">
        <h2>${this._product.name}</h2>
        <div class="price">${this._product.price.toFixed(2)} &euro;</div>
        <p class="description">${this._product.description}</p>
        <button class="add-cart" @click=${this._addToCart} style="margin-top: 1rem;">
          Añadir al carrito
        </button>
        ${this._justAdded ? html`<p class="added-msg">Añadido al carrito</p>` : ''}
      </div>

      <div class="nav-buttons">
        ${Object.keys(PRODUCTS)
          .filter(id => id !== this._productId)
          .map(id => html`
            <button class="nav"
              @click=${() => this.pageController.navigate('product', { id })}>
              Ver producto ${id}
            </button>
          `)}
      </div>

      <div class="param-info">
        Ruta: <code>/product/:id</code> →
        Parámetro recibido: <code>id = "${this._productId}"</code>
      </div>
    `;
  }
}
