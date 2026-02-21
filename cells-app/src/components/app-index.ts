// ═══════════════════════════════════════════════════════════════
// APP-INDEX — Con interceptor para rutas protegidas
//
// El interceptor se ejecuta ANTES de cada navegación.
// Recibe el objeto de navegación y un contexto mutable.
// Si retorna { intercept: true, redirect: 'login' },
// Cells redirige automáticamente.
//
// skipNavigations lista las rutas que NO pasan por el interceptor
// (para evitar bucles infinitos con login).
//
// Comparación:
//   Angular:  CanActivate guard
//   React:    ProtectedRoute + Context
//   Vue:      beforeEach en vue-router
//   Stencil:  No tiene equivalente nativo
// ═══════════════════════════════════════════════════════════════

import { startApp } from '@open-cells/core';
import { routes } from '../router/routes.js';
import './app-header.js';

startApp({
  routes,
  mainNode: 'app-content',

  // Interceptor: verifica autenticación antes de navegar
  interceptor: (
    _navigation: { name: string },
    ctx: { isAuthenticated?: boolean }
  ) => {
    if (!ctx.isAuthenticated) {
      return { intercept: true, redirect: 'login' };
    }
    return { intercept: false, redirect: '' };
  },

  // Rutas que NO pasan por el interceptor
  skipNavigations: ['home', 'about', 'demo', 'product', 'login', 'not-found'],
});
