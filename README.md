# 17 — E-commerce con Lit + Cells

> Rama: `17-ecommerce` | Anterior: `16-proyecto-final` | [Índice](../../tree/main)

Mini e-commerce que pone a prueba los conceptos de **Lit** y **Open Cells** en un proyecto realista.

## Funcionalidades

- **Catálogo** con filtros por categoría y búsqueda con debounce
- **Detalle de producto** con params dinámicos (`:id`)
- **Carrito** con gestión de cantidades y total
- **Wishlist/Favoritos** — segundo canal independiente
- **Toasts** — notificaciones en tiempo real
- **onPageLeave** — cleanup al salir del carrito

## Conceptos de Cells ejercitados

| Concepto | Dónde se usa |
|----------|-------------|
| `startApp()` + rutas | `app-index.ts` — bootstrap con lazy loading |
| `PageController` | Todas las páginas — lifecycle (`onPageEnter`, `onPageLeave`) |
| `subscribe(ch, node, cb)` | CartController, WishlistController, ToastController |
| `publish(ch, data)` | Acciones del carrito, wishlist, toasts |
| `unsubscribe(ch, node)` | `hostDisconnected()` en todos los controllers |
| `navigate(page, params)` | Navegación entre home, product/:id, cart |
| Canales múltiples | `cart-items`, `wishlist-items`, `toast-messages` |
| Componente fuera del router | `app-header` y `toast-container` (persistentes) |
| `onPageEnter` | product-page (leer `:id`), cart-page (reset flags) |
| `onPageLeave` | cart-page (notificar cambios guardados) |

## Conceptos de Lit ejercitados

| Concepto | Dónde se usa |
|----------|-------------|
| Reactive Controllers | `CartController`, `WishlistController`, `SearchController`, `ToastController` |
| `@property` / `@state` | Props de product-card, estado interno de páginas |
| `@query` | cart-page (referencia a `.cart-list`) |
| `repeat(items, key, tpl)` | Catálogo, carrito, toasts |
| `when(cond, thenTpl)` | Condicionales en carrito vacío, badges, not-found |
| `classMap({...})` | Botón "Añadido", wishlist activo/inactivo |
| `guard([deps], fn)` | Evitar re-renders en product-card |
| `live(value)` | Input de búsqueda sincronizado |
| Custom Events | `@add-to-cart`, `@go-to-detail`, `@toggle-wishlist` |
| Shadow DOM + `:host` | Estilos encapsulados en cada componente |

## Estructura

```
cells-app/src/
├── components/
│   ├── app-index.ts          # Bootstrap con startApp()
│   ├── app-header.ts         # Header persistente (cart + wishlist badges)
│   ├── product-card.ts       # Tarjeta con favorito + añadir
│   └── toast-container.ts    # Notificaciones (fuera del router)
├── controllers/
│   ├── cart-controller.ts    # Canal: cart-items
│   ├── wishlist-controller.ts # Canal: wishlist-items
│   ├── search-controller.ts  # Debounce (sin canal, lógica pura)
│   └── toast-controller.ts   # Canal: toast-messages
├── data/
│   └── products.ts           # Catálogo (8 productos)
├── pages/
│   ├── home/home-page.ts     # Catálogo + búsqueda + filtros
│   ├── product/product-page.ts  # Detalle + carrito + wishlist
│   └── cart/cart-page.ts     # Carrito + onPageLeave
└── router/
    └── routes.ts             # home, product/:id, cart
```

## Flujo de datos (3 canales)

```
                         ┌─── cart-items ───┐
product-card ──events──▶ │                   │
                         │   CartController   │──▶ app-header (badge)
home-page ──cart.add()──▶│                   │──▶ cart-page (listado)
                         └───────────────────┘──▶ product-page (cantidad)

                         ┌─ wishlist-items ─┐
product-card ──events──▶ │                   │
                         │ WishlistController │──▶ app-header (badge)
product-page ──toggle()─▶│                   │──▶ product-card (corazón)
                         └───────────────────┘

                         ┌─ toast-messages ──┐
cualquier componente ───▶│                   │
  toast.show('msg')      │  ToastController   │──▶ toast-container (esquina)
                         └───────────────────┘
```

## API de Channels — Gotcha

```typescript
// ✅ subscribe requiere el nodo HTML como 2º argumento
subscribe('cart-items', this.host, (items) => { ... });
unsubscribe('cart-items', this.host);

// ✅ publish solo necesita canal + datos
publish('cart-items', updatedItems);
```

Sin el nodo, Open Cells falla con `Cannot read properties of undefined (reading 'includes')`.

## Cómo ejecutar

```bash
cd cells-app
pnpm install
pnpm dev
```
