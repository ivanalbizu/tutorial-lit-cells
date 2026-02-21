import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';

// ═══════════════════════════════════════════════════════════════
// PÁGINA CON PARÁMETROS DINÁMICOS
//
// Open Cells soporta rutas con parámetros:
//   { path: '/product/:id', name: 'product', ... }
//
// Los parámetros se reciben en onPageEnter() a través
// del PageController. Se navega con:
//   pageController.navigate('product', { id: '42' })
//
// Comparación con Stencil:
//   <stencil-route path="/product/:id" componentProps={{ ... }} />
//   Los params llegan como @Prop() en el componente.
//
// En Open Cells, los params se pasan como propiedades
// al componente de la página automáticamente.
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
  `;

  onPageEnter() {
    // Los parámetros de ruta se asignan como propiedades del componente
    // Open Cells hace: element[paramName] = value
    // Así que :id se convierte en this.id, pero como es una propiedad
    // nativa de HTMLElement, usamos un approach diferente:
    // Leemos los params del hash de la URL directamente
    this._readParams();
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
