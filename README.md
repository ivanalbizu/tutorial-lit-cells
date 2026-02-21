# Paso 12 — Introducción a Open Cells

> Rama: `12-intro-cells` | Anterior: `11-decoradores-avanzados` | [Índice](../../tree/main)

## ¿Qué es Open Cells?

**Open Cells** es un framework de micro-frontends creado por BBVA. Está construido sobre **web components estándar** y se integra perfectamente con **Lit**.

Sus responsabilidades principales son:

1. **Routing** — Navegación basada en hash (`#!/ruta`)
2. **Orquestación de páginas** — Cada página es un web component independiente
3. **Estado compartido** — Sistema pub/sub con canales (channels)
4. **Lazy loading** — Las páginas se cargan bajo demanda

## Comparación con otros frameworks

| Concepto | Open Cells | Stencil | React | Angular |
|---|---|---|---|---|
| Routing | `startApp({ routes })` | `@stencil/router` | `react-router` | `RouterModule` |
| Páginas | Web Components | Web Components | Componentes React | Componentes Angular |
| Estado | Channels (pub/sub) | Stores/Stencil Store | Context/Redux | Services/RxJS |
| Lazy loading | `action: () => import()` | Dynamic imports | `React.lazy()` | `loadChildren` |

## Arquitectura

```
cells-app/
├── index.html                    ← Punto de entrada HTML
├── src/
│   ├── components/
│   │   └── app-index.ts          ← Llama a startApp() — bootstrap
│   ├── router/
│   │   └── routes.ts             ← Definición de rutas
│   ├── pages/
│   │   ├── home/
│   │   │   └── home-page.ts      ← Página principal (LitElement)
│   │   ├── about/
│   │   │   └── about-page.ts     ← Página about (LitElement)
│   │   └── not-found/
│   │       └── not-found-page.ts ← Página 404
│   └── css/
│       └── main.css              ← Estilos globales
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Conceptos clave

### 1. `startApp()` — Bootstrap de la aplicación

```typescript
// src/components/app-index.ts
import { startApp } from '@open-cells/core';
import { routes } from '../router/routes.js';

startApp({
  routes,                    // Array de rutas
  mainNode: 'app-content',  // ID del elemento contenedor
});
```

El `mainNode` es el ID del elemento HTML donde Open Cells monta las páginas. Debe coincidir con el `id` del elemento en `index.html`:

```html
<app-index id="app-content"></app-index>
<script type="module" src="./src/components/app-index.ts"></script>
```

### 2. Definición de rutas

```typescript
// src/router/routes.ts
export const routes = [
  {
    path: '/',
    name: 'home',
    component: 'home-page',
    action: async () => {
      await import('../pages/home/home-page.js');
    },
  },
  // ...más rutas
];
```

Cada ruta tiene:
- **`path`** — La URL (sin `#!/`)
- **`name`** — Nombre para navegación programática
- **`component`** — Tag del web component
- **`action`** — Import dinámico (lazy loading)
- **`notFound`** — (opcional) Ruta fallback para 404

### 3. Páginas = Web Components

Cada página es un **LitElement normal**:

```typescript
@customElement('home-page')
export class HomePage extends LitElement {
  render() {
    return html`<h1>Home</h1>`;
  }
}
```

Open Cells se encarga de:
- Crear la instancia del componente
- Insertarlo en el DOM (dentro de `mainNode`)
- Quitarlo al navegar a otra ruta

### 4. Paquetes de Open Cells

| Paquete | Función |
|---|---|
| `@open-cells/core` | Router, `startApp()`, channels, navegación |
| `@open-cells/page-controller` | Reactive Controller para páginas (lifecycle, channels) |
| `@open-cells/element-controller` | Controller base para cualquier componente |

## Ejecutar la app

```bash
cd cells-app
pnpm install
pnpm dev
```

La app usa **hash routing**, así que las URLs serán:
- `http://localhost:5173/#!/`
- `http://localhost:5173/#!/about`

## Próximos pasos

En las siguientes ramas veremos:
- **13-lit-en-cells** — Integrar componentes Lit dentro de páginas Cells
- **14-routing-cells** — Navegación avanzada (parámetros, guards, interceptors)
- **15-estado-cells** — Estado compartido con channels (pub/sub)
