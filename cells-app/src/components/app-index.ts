// ═══════════════════════════════════════════════════════════════
// APP-INDEX — Punto de entrada de Open Cells
//
// Importa los componentes compartidos (header) y arranca la app.
//
// mainNode apunta a un <div id="app-content"> en index.html.
// Open Cells monta/desmonta las páginas como hijos de ese div.
//
// El header está FUERA del mainNode para que sea persistente
// y no se destruya al cambiar de página.
// ═══════════════════════════════════════════════════════════════

import { startApp } from '@open-cells/core';
import { routes } from '../router/routes.js';
import './app-header.js';

startApp({
  routes,
  mainNode: 'app-content',
});
