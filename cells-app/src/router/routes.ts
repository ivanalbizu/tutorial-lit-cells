// ═══════════════════════════════════════════════════════════════
// RUTAS — Con parámetros dinámicos y rutas protegidas
//
// Novedades en esta rama:
//   - /product/:id — Ruta con parámetro dinámico
//   - /protected   — Ruta protegida por interceptor
//   - /login       — Página de login (redirect del interceptor)
//
// El parámetro :id se pasa al componente como propiedad.
// Para navegar: navigate('product', { id: '42' })
// ═══════════════════════════════════════════════════════════════

export const routes = [
  {
    path: '/',
    name: 'home',
    component: 'home-page',
    action: async () => {
      await import('../pages/home/home-page.js');
    },
  },
  {
    path: '/about',
    name: 'about',
    component: 'about-page',
    action: async () => {
      await import('../pages/about/about-page.js');
    },
  },
  {
    path: '/demo',
    name: 'demo',
    component: 'demo-page',
    action: async () => {
      await import('../pages/demo/demo-page.js');
    },
  },
  // Ruta con parámetro dinámico :id
  {
    path: '/product/:id',
    name: 'product',
    component: 'product-page',
    action: async () => {
      await import('../pages/product/product-page.js');
    },
  },
  // Ruta protegida por el interceptor
  {
    path: '/protected',
    name: 'protected',
    component: 'protected-page',
    action: async () => {
      await import('../pages/protected/protected-page.js');
    },
  },
  // Carrito — recibe estado via channels
  {
    path: '/cart',
    name: 'cart',
    component: 'cart-page',
    action: async () => {
      await import('../pages/cart/cart-page.js');
    },
  },
  // Página de login (excluida del interceptor via skipNavigations)
  {
    path: '/login',
    name: 'login',
    component: 'login-page',
    action: async () => {
      await import('../pages/login/login-page.js');
    },
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: 'not-found-page',
    notFound: true,
    action: async () => {
      await import('../pages/not-found/not-found-page.js');
    },
  },
];
