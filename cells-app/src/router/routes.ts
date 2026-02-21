// ═══════════════════════════════════════════════════════════════
// RUTAS DE OPEN CELLS
//
// Cada ruta define:
//   - path:      URL de la ruta (sin el #!/)
//   - name:      Nombre interno para navegación programática
//   - component: Tag del web component que renderiza la página
//   - action:    Función async que importa el componente (lazy loading)
//   - notFound:  (opcional) marca la ruta como fallback 404
//
// Open Cells usa hash-based routing (#!/ruta).
// El router inyecta el componente de la página como hijo
// del elemento mainNode definido en startApp().
//
// Comparación con otros frameworks:
//   Stencil:  @stencil/router con <stencil-route path="..." component="...">
//   React:    react-router con <Route path="..." element={<Page />} />
//   Angular:  RouterModule.forRoot([{ path, component, loadChildren }])
//   Vue:      vue-router createRouter({ routes: [{ path, component }] })
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
    path: '/not-found',
    name: 'not-found',
    component: 'not-found-page',
    notFound: true,
    action: async () => {
      await import('../pages/not-found/not-found-page.js');
    },
  },
];
