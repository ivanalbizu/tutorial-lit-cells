// ═══════════════════════════════════════════════════════════════
// APP-INDEX — Con interceptor para rutas protegidas
//
// El interceptor se ejecuta ANTES de cada navegación.
// Recibe el objeto de navegación y un contexto mutable.
//
// IMPORTANTE: skipNavigations NO evita el interceptor.
// Solo controla qué navegaciones se saltan en el historial.
// Para rutas públicas, el interceptor debe retornar
// { intercept: false } explícitamente.
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

// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = ['home', 'about', 'demo', 'product', 'cart', 'login', 'not-found'];

startApp({
  routes,
  mainNode: 'app-content',

  // Interceptor: solo protege rutas que NO son públicas
  interceptor: (
    navigation: { to?: { page?: string } },
    ctx: { isAuthenticated?: boolean }
  ) => {
    const targetPage = navigation.to?.page || '';

    // Si la ruta es pública, dejar pasar
    if (PUBLIC_ROUTES.includes(targetPage)) {
      return { intercept: false, redirect: '' };
    }

    // Ruta protegida: verificar autenticación
    if (!ctx.isAuthenticated) {
      return { intercept: true, redirect: { page: 'login' } };
    }

    return { intercept: false, redirect: '' };
  },
});
