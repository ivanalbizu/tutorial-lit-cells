# Paso 16 — Proyecto final

> Rama: `16-proyecto-final` | Anterior: `15-estado-cells` | [Índice](../../tree/main)

## Qué hemos hecho

En esta rama unificamos **todos los conceptos del tutorial** en una app cohesiva. Mejoramos la app existente integrando técnicas de las Fases 1-2 dentro del contexto de Cells.

## Conceptos integrados

### 1. CartController — Reactive Controller + Channels

Centralizamos la lógica del carrito en un **Reactive Controller** (rama 10) que internamente usa **channels pub/sub** (rama 15):

```typescript
// controllers/cart-controller.ts
export class CartController implements ReactiveController {
  items: CartItem[] = [];
  get total(): number { /* ... */ }
  get count(): number { /* ... */ }

  hostConnected() { subscribe('ch-cart', ...); }   // auto-suscripción
  hostDisconnected() { unsubscribe('ch-cart'); }    // auto-limpieza

  add(product) { publish('ch-cart', updated); }
  remove(id) { /* ... */ }
  clear() { /* ... */ }
}
```

Uso en cualquier componente:
```typescript
cart = new CartController(this);
// this.cart.items, this.cart.total, this.cart.add(product)
```

### 2. Directivas en páginas Cells

```typescript
// when() — condicional lazy (rama 08)
${when(this.cart.isEmpty,
  () => this._renderEmpty(),
  () => this._renderCart()
)}

// classMap() — clases condicionales (rama 08)
<div class=${classMap({ 'product-card': true, 'in-cart': isInCart })}>

// repeat() con keys — lista eficiente (rama 08)
${repeat(this.cart.items, item => item.id, item => html`...`)}
```

### 3. page-layout con slots (composición, rama 09)

```typescript
<page-layout pageTitle="Carrito">
  <span slot="subtitle">${this.cart.count} artículos</span>
  <div><!-- contenido principal (slot default) --></div>
  <div slot="footer">Info técnica</div>
</page-layout>
```

### 4. @query — Acceso declarativo al DOM (rama 11)

```typescript
@query('#cart-list')
private _cartList!: HTMLElement;
this._cartList?.scrollTo({ top: 0, behavior: 'smooth' });
```

### 5. Badge dinámico en el header

El `CartController` funciona en componentes compartidos (no solo páginas Cells):

```typescript
// app-header.ts — badge con when()
cart = new CartController(this);
${when(!this.cart.isEmpty, () => html`
  <span class="badge">${this.cart.count}</span>
`)}
```

## Mapa de conceptos por archivo

| Archivo | Conceptos del tutorial |
|---|---|
| `controllers/cart-controller.ts` | Reactive Controller (10) + Channels (15) |
| `pages/product/product-page.ts` | PageController (13), CartController, when, classMap, slots |
| `pages/cart/cart-page.ts` | CartController, repeat, when, @query, slots |
| `components/app-header.ts` | CartController, when, badge dinámico |
| `components/page-layout.ts` | Slots: default, named (subtitle, footer) |

## Ejecutar

```bash
cd cells-app
pnpm dev
```

1. Home → Producto 1 → "Añadir al carrito" → badge aparece en header
2. Añade más productos → badge se actualiza en tiempo real
3. Carrito → botones +/- y "Quitar" → todo reactivo
4. Borde verde en tarjeta de producto si está en carrito (classMap)

## Resumen del tutorial completo

| Fase | Ramas | Temas |
|---|---|---|
| **1 — Fundamentos** | 01-07 | Componentes, propiedades, templates, eventos, lifecycle, estilos |
| **2 — Intermedio** | 08-11 | Directivas, slots, Reactive Controllers, decoradores |
| **3 — Cells** | 12-15 | startApp, PageController, routing, channels |
| **4 — Proyecto** | 16 | Todo integrado en una app funcional |
