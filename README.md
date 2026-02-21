# Paso 13 — Componentes Lit dentro de Open Cells

> Rama: `13-lit-en-cells` | Anterior: `12-intro-cells` | [Índice](../../tree/main)

## Qué hemos hecho

En esta rama integramos **componentes Lit reutilizables** dentro de una app Open Cells, y añadimos **navegación** con `PageController`.

## Conceptos nuevos

### 1. Componentes compartidos (fuera del router)

El `<app-header>` es un componente Lit normal que vive **fuera** del `mainNode`. Open Cells solo gestiona lo que hay dentro del contenedor de páginas:

```html
<!-- index.html -->
<app-header></app-header>          <!-- Persistente, no lo toca Cells -->
<div id="app-content"></div>       <!-- Cells monta/desmonta páginas aquí -->
```

### 2. Componentes reutilizables dentro de páginas

`<feature-card>` es un componente Lit puro (sin dependencia de Cells). Se usa dentro de las páginas exactamente igual que en una app Lit sin Cells:

```typescript
// En cualquier página
import '../../components/feature-card.js';

render() {
  return html`
    <feature-card
      icon="🔥"
      title="Lit"
      description="Web Components reactivos"
    ></feature-card>
  `;
}
```

### 3. PageController — Reactive Controller para páginas

`PageController` es un **Reactive Controller** de Lit (como `ClockController` de la rama 10). Proporciona:

```typescript
@customElement('demo-page')
export class DemoPage extends LitElement {
  // Se instancia como class field
  pageController = new PageController(this);

  // Lifecycle de Cells — se llama al entrar a la página
  onPageEnter() {
    console.log('Página visible');
  }

  // Lifecycle de Cells — se llama al salir
  onPageLeave() {
    console.log('Página oculta');
  }

  render() {
    return html`
      <!-- Navegación programática -->
      <button @click=${() => this.pageController.navigate('home')}>
        Ir a Home
      </button>
    `;
  }
}
```

### 4. Navegación global con `navigate()`

Para componentes que no son páginas (como el header), se usa la función global:

```typescript
import { navigate } from '@open-cells/core';

// En cualquier componente
navigate('about');
```

## Comparación con Stencil

| Concepto | Open Cells + Lit | Stencil |
|---|---|---|
| Componente reutilizable | `LitElement` importado | `@Component` importado |
| Navegación en página | `pageController.navigate('name')` | `this.history.push('/path')` |
| Navegación global | `navigate('name')` de `@open-cells/core` | `<stencil-route-link>` |
| Lifecycle de página | `onPageEnter()` / `onPageLeave()` | No existe |
| Componente persistente | Fuera del `mainNode` | Fuera de `<stencil-router>` |

## Estructura actualizada

```
cells-app/src/
├── components/
│   ├── app-index.ts          ← Bootstrap + importa header
│   ├── app-header.ts         ← Navegación persistente (NEW)
│   └── feature-card.ts       ← Componente reutilizable (NEW)
├── pages/
│   ├── home/home-page.ts     ← Usa PageController + feature-card
│   ├── about/about-page.ts   ← Usa PageController
│   ├── demo/demo-page.ts     ← Demo interactiva con PageController (NEW)
│   └── not-found/
└── router/routes.ts          ← Añadida ruta /demo
```

## Ejecutar

```bash
cd cells-app
pnpm dev
```

Navega entre páginas usando el header o los botones. Observa cómo el contador de `onPageEnter` incrementa en la página Demo al volver a ella.
