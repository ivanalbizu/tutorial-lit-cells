// ═══════════════════════════════════════════════════════════════
// APP-INDEX — Punto de entrada de Open Cells
//
// Este archivo NO define un LitElement con render().
// Su única responsabilidad es llamar a startApp() con la
// configuración de la aplicación.
//
// startApp() recibe:
//   - routes:    Array de definiciones de rutas
//   - mainNode:  ID del elemento DOM donde se montan las páginas
//
// El elemento <app-index id="app-content"> en index.html
// actúa como contenedor. Open Cells inyecta/quita los
// componentes de página como hijos de este elemento.
//
// Comparación:
//   Stencil:  main.ts con defineCustomElements()
//   React:    index.tsx con ReactDOM.createRoot()
//   Angular:  main.ts con bootstrapApplication()
//   Vue:      main.ts con createApp().mount()
// ═══════════════════════════════════════════════════════════════

import { startApp } from '@open-cells/core';
import { routes } from '../router/routes.js';

startApp({
  routes,
  mainNode: 'app-content',
});
