# Paso 14 — Routing avanzado en Open Cells

> Rama: `14-routing-cells` | Anterior: `13-lit-en-cells` | [Índice](../../tree/main)

## Qué hemos hecho

En esta rama exploramos las capacidades avanzadas de routing de Open Cells:
- **Rutas con parámetros dinámicos** (`:id`)
- **Interceptor** (guard de autenticación)
- **Navegación con parámetros**

## Conceptos nuevos

### 1. Rutas con parámetros dinámicos

```typescript
// routes.ts
{
  path: '/product/:id',
  name: 'product',
  component: 'product-page',
  action: async () => { await import('../pages/product/product-page.js'); },
}

// Navegar con parámetros
pageController.navigate('product', { id: '42' });
// → URL: #!/product/42
```

Equivalencias:
- **Stencil**: `<stencil-route path="/product/:id" />` + `@Prop() match`
- **React**: `useParams()` de react-router
- **Angular**: `ActivatedRoute.params`
- **Vue**: `useRoute().params`

### 2. Interceptor (auth guard)

El interceptor se ejecuta **antes** de cada navegación. Si retorna `{ intercept: true, redirect: 'login' }`, Cells redirige automáticamente:

```typescript
// app-index.ts
startApp({
  routes,
  mainNode: 'app-content',

  interceptor: (navigation, ctx) => {
    if (!ctx.isAuthenticated) {
      return { intercept: true, redirect: 'login' };
    }
    return { intercept: false, redirect: '' };
  },

  // Rutas exentas del interceptor
  skipNavigations: ['home', 'about', 'login'],
});
```

### 3. Gestión del contexto del interceptor

```typescript
import {
  updateInterceptorContext,
  getInterceptorContext,
} from '@open-cells/core';

// Login: marcar como autenticado
updateInterceptorContext({ isAuthenticated: true, user: 'Juan' });

// Logout: resetear
updateInterceptorContext({ isAuthenticated: false, user: '' });

// Leer contexto actual
const ctx = getInterceptorContext();
```

## Comparación con otros frameworks

| Concepto | Open Cells | Angular | React | Stencil |
|---|---|---|---|---|
| Params dinámicos | `/product/:id` | `:id` en Route | `:id` + `useParams` | `:id` + `@Prop() match` |
| Guard | `interceptor` en startApp | `CanActivate` | `<ProtectedRoute>` | No nativo |
| Skip guard | `skipNavigations: [...]` | Decorador en ruta | Lógica manual | N/A |
| Contexto auth | `updateInterceptorContext()` | Service inyectado | Context/Redux | Store manual |

## Nuevas páginas

| Página | Ruta | Descripción |
|---|---|---|
| `product-page` | `/product/:id` | Detalle con parámetro dinámico |
| `login-page` | `/login` | Login simulado para el interceptor |
| `protected-page` | `/protected` | Solo accesible tras login |

## Probar

```bash
cd cells-app
pnpm dev
```

1. Desde Home, haz click en "Producto 1", "Producto 2", etc.
2. Haz click en "Zona protegida" en el header → te redirige a Login
3. Escribe un nombre y haz click en "Entrar" → accedes a la zona protegida
4. Haz click en "Cerrar sesión" → vuelve a Home
