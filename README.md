# Paso 15 — Estado compartido con Channels

> Rama: `15-estado-cells` | Anterior: `14-routing-cells` | [Índice](../../tree/main)

## Qué hemos hecho

En esta rama implementamos un **carrito de compras** usando el sistema de **channels** (pub/sub) de Open Cells para compartir estado entre páginas.

## Conceptos nuevos

### 1. Channels — Pub/Sub global

Open Cells tiene un sistema de mensajería basado en canales. Cualquier componente puede **publicar** datos en un canal y cualquier otro puede **suscribirse** para recibirlos:

```typescript
// Suscribirse a un canal
this.pageController.subscribe('ch-cart', (items) => {
  this._items = items;
});

// Publicar datos en un canal
this.pageController.publish('ch-cart', updatedItems);

// Dejar de escuchar
this.pageController.unsubscribe('ch-cart');
```

### 2. Patrón típico: subscribe en onPageEnter, unsubscribe en onPageLeave

```typescript
@customElement('cart-page')
export class CartPage extends LitElement {
  pageController = new PageController(this);

  @state() private _items: CartItem[] = [];

  onPageEnter() {
    this.pageController.subscribe('ch-cart', (items: CartItem[]) => {
      this._items = [...items];
    });
  }

  onPageLeave() {
    this.pageController.unsubscribe('ch-cart');
  }
}
```

### 3. Flujo del carrito

```
┌─────────────┐     publish('ch-cart', items)     ┌─────────────┐
│ product-page │ ──────────────────────────────── → │  cart-page   │
│              │                                    │              │
│ "Añadir al   │     subscribe('ch-cart', cb)      │ Muestra      │
│  carrito"    │ ← ──────────────────────────────  │ los items    │
└─────────────┘                                    └─────────────┘
```

1. `product-page` publica el carrito actualizado en `'ch-cart'`
2. `cart-page` está suscrita a `'ch-cart'` y se actualiza automáticamente
3. Ambas páginas pueden modificar y publicar cambios

## Comparación con otros frameworks

| Concepto | Open Cells | React | Angular | Vue | Stencil |
|---|---|---|---|---|---|
| Estado global | Channels (pub/sub) | Context/Redux/Zustand | Services + RxJS | Pinia/Vuex | Stencil Store |
| Suscripción | `subscribe(ch, cb)` | `useContext()` / `useSelector()` | `service.obs$.subscribe()` | `store.state` | `onChange()` |
| Publicación | `publish(ch, data)` | `dispatch()` / `setState()` | `service.next()` | `store.action()` | `state.prop = val` |
| Desuscripción | `unsubscribe(ch)` | Cleanup de useEffect | `.unsubscribe()` | Automático | Automático |

## Ventajas del sistema de channels

1. **Desacoplado** — Las páginas no se conocen entre sí
2. **Global** — Cualquier componente puede participar
3. **Simple** — No requiere store, reducers, ni boilerplate
4. **Lifecycle-aware** — Se limpia con `onPageLeave`

## Archivos nuevos/modificados

| Archivo | Cambio |
|---|---|
| `pages/cart/cart-page.ts` | **NEW** — Página del carrito con subscribe |
| `pages/product/product-page.ts` | Añadido botón "Añadir al carrito" con publish |
| `router/routes.ts` | Añadida ruta `/cart` |
| `components/app-header.ts` | Añadido link al carrito |

## Probar

```bash
cd cells-app
pnpm dev
```

1. Ve a Home → click en "Producto 1"
2. Click en "Añadir al carrito"
3. Vuelve a Home → click en "Producto 2" → "Añadir al carrito"
4. Click en "Carrito" en el header
5. Modifica cantidades o elimina items
6. Vuelve a productos y añade más — el carrito se mantiene

## Cómo gestiona Open Cells las páginas (importante)

Open Cells **no destruye** las páginas al navegar — las oculta y las mantiene en el DOM como caché:

```
Navegas: Home → About → Demo → Cart

DOM resultante (con viewLimit: 3):
┌─────────────────────────────┐
│ #app-content                │
│  ├─ home-page   state="cached"   ← oculta (display:none)
│  ├─ about-page  state="cached"   ← oculta
│  ├─ demo-page   state="inactive" ← oculta (fue desalojada por viewLimit)
│  └─ cart-page   state="active"   ← VISIBLE
└─────────────────────────────┘
```

### CSS obligatorio

Open Cells **no incluye CSS** para ocultar las páginas inactivas. Sin este CSS, todas las páginas se apilan visibles:

```css
#app-content > [state="cached"],
#app-content > [state="inactive"] {
  display: none;
}
```

### viewLimit — Control de caché

`viewLimit` (por defecto **3**) controla cuántas páginas se mantienen en el DOM. Al superar el límite, la más antigua se elimina. `persistentPages` excluye páginas del límite:

```typescript
startApp({
  routes,
  mainNode: 'app-content',
  viewLimit: 2,               // solo 2 en caché
  persistentPages: ['home'],  // home nunca se destruye
});
```

### Ventaja de la caché

Al volver a una página cacheada, se **reactiva instantáneamente** (sin re-crear el componente). El scroll y el estado del DOM se conservan. Es el mismo patrón que `<keep-alive>` en Vue o el Fragment backstack en Android.

### Interceptor — Gotchas

```typescript
// ❌ MAL — redirect debe ser objeto, no string
return { intercept: true, redirect: 'login' };

// ✅ BIEN
return { intercept: true, redirect: { page: 'login' } };
```

```typescript
// ❌ MAL — skipNavigations NO evita el interceptor
// Solo controla qué navegaciones se saltan en el historial
skipNavigations: ['home', 'about']

// ✅ BIEN — El interceptor decide qué rutas son públicas
interceptor: (navigation, ctx) => {
  const target = navigation.to?.page || '';
  if (PUBLIC_ROUTES.includes(target)) {
    return { intercept: false, redirect: '' };
  }
  // ...verificar auth
}
```

## Resumen de la Fase 3

| Rama | Tema |
|---|---|
| `12-intro-cells` | Scaffold, arquitectura, `startApp()` |
| `13-lit-en-cells` | Componentes Lit reutilizables, `PageController` |
| `14-routing-cells` | Params dinámicos, interceptor, auth guard |
| `15-estado-cells` | Channels pub/sub, carrito de compras |
