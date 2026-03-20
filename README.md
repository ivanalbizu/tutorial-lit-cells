# 17 — E-commerce con Lit + Cells

> Rama: `17-ecommerce` | Anterior: `16-proyecto-final` | [Índice](../../tree/main)

Mini e-commerce funcional que integra todos los conceptos del tutorial.

## Funcionalidades

- **Catálogo** — Grid de productos con filtro por categoría
- **Detalle** — Página de producto con params dinámicos (`:id`)
- **Carrito** — Gestión de cantidades, eliminar, vaciar
- **Badge** — Contador en el header sincronizado en tiempo real
- **Lazy loading** — Cada página se carga bajo demanda

## Estructura

```
cells-app/src/
├── components/
│   ├── app-index.ts         # Bootstrap con startApp()
│   ├── app-header.ts        # Header persistente + badge carrito
│   └── product-card.ts      # Tarjeta de producto reutilizable
├── controllers/
│   └── cart-controller.ts   # Reactive Controller + Channels
├── data/
│   └── products.ts          # Catálogo de productos
├── pages/
│   ├── home/home-page.ts    # Catálogo con filtros
│   ├── product/product-page.ts  # Detalle con añadir al carrito
│   └── cart/cart-page.ts    # Carrito completo
├── router/
│   └── routes.ts            # 3 rutas: home, product/:id, cart
├── css/
│   └── main.css             # Estilos globales + visibilidad páginas
└── types/
    └── open-cells.d.ts      # Tipados para Open Cells
```

## Conceptos aplicados

| Concepto | Rama origen | Uso |
|----------|------------|-----|
| `@customElement` | 02 | Todos los componentes |
| `@property`, `@state` | 03 | Props de product-card, estado interno |
| `repeat()`, `when()`, `classMap()` | 08 | Listas, condicionales, clases dinámicas |
| Custom Events | 05 | product-card → home-page |
| Reactive Controllers | 10 | CartController |
| Channels pub/sub | 15 | Estado del carrito compartido |
| PageController | 13 | Lifecycle de páginas |
| Params dinámicos | 14 | product/:id |
| Lazy loading | 12 | Importación dinámica en rutas |

## Cómo ejecutar

```bash
cd cells-app
pnpm install   # Usar pnpm, no npm
pnpm dev
```

Navega a `http://localhost:5173`

## Flujo de datos

```
product-card  ──@add-to-cart──▶  home-page  ──cart.add()──▶  CartController
                                                                    │
                                                              publish('cart-items')
                                                                    │
                                                    ┌───────────────┼───────────────┐
                                                    ▼               ▼               ▼
                                               app-header      cart-page      product-page
                                               (badge)         (listado)     (cantidad en carrito)
```

Todos los componentes con `CartController` se sincronizan automáticamente via Channels.
