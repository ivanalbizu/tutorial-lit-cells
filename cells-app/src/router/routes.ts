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
    path: '/product/:id',
    name: 'product',
    component: 'product-page',
    action: async () => {
      await import('../pages/product/product-page.js');
    },
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: 'wishlist-page',
    action: async () => {
      await import('../pages/wishlist/wishlist-page.js');
    },
  },
  {
    path: '/cart',
    name: 'cart',
    component: 'cart-page',
    action: async () => {
      await import('../pages/cart/cart-page.js');
    },
  },
];
