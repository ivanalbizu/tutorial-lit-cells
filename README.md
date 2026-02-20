# 10 — Reactive Controllers

> Rama: `10-reactive-controllers` | Anterior: `09-slots` | [Índice](../../tree/main)

## Qué hemos hecho

Tres **Reactive Controllers** reutilizables y un componente que los consume:
- `ClockController` — Timer con cleanup automático
- `MouseController` — Posición del ratón con listener global
- `FetchController<T>` — Fetch genérico con loading/error/abort

## ¿Qué son los Reactive Controllers?

Son clases que **encapsulan lógica reutilizable** y participan en el ciclo de vida del componente. Piensa en ellos como "hooks" para Lit.

**Stencil no tiene equivalente directo.** Lo más cercano sería:
- Servicios/clases externas (pero sin acceso al lifecycle)
- Mixins (herencia múltiple, pero frágil)

| Framework | Equivalente |
|-----------|-------------|
| Lit | Reactive Controllers |
| React | Custom Hooks |
| Angular | Services con lifecycle |
| Vue | Composables (Composition API) |

## Anatomía de un Controller

```ts
import { ReactiveController, ReactiveControllerHost } from 'lit';

export class MyController implements ReactiveController {
  host: ReactiveControllerHost;

  // Estado del controller (accesible desde el componente)
  value = 0;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);  // Registrarse en el host
  }

  // Lifecycle hooks (opcionales)
  hostConnected() {
    // El componente se montó → iniciar recursos
  }

  hostDisconnected() {
    // El componente se desmontó → limpiar recursos
  }

  hostUpdate() {
    // Antes de cada render del host
  }

  hostUpdated() {
    // Después de cada render del host
  }
}
```

## Usar un Controller en un componente

```ts
@customElement('my-comp')
export class MyComp extends LitElement {
  // Instanciar como class field — se registra automáticamente
  private _clock = new ClockController(this);
  private _mouse = new MouseController(this);

  render() {
    // Acceder al estado del controller
    return html`
      <p>Hora: ${this._clock.value.toLocaleTimeString()}</p>
      <p>Ratón: ${this._mouse.x}, ${this._mouse.y}</p>
    `;
  }

  // No necesitas connectedCallback ni disconnectedCallback
  // Los controllers gestionan su propio lifecycle
}
```

## Ventaja clave: composición sin herencia

En Stencil, para reutilizar lógica de lifecycle tendrías que recurrir a mixins o herencia. Con controllers puedes **componer** múltiples comportamientos sin conflictos:

```ts
// Un componente puede tener N controllers sin problema
private _clock = new ClockController(this);
private _mouse = new MouseController(this);
private _data = new FetchController(this, '/api/items');
private _resize = new ResizeController(this);
```

Cada controller gestiona su propio setup/cleanup. No hay herencia, no hay conflictos de nombres.

## Controllers vs Mixins

| Aspecto | Mixins (Stencil) | Controllers (Lit) |
|---------|-----------------|-------------------|
| Mecanismo | Herencia | Composición |
| Conflictos de nombre | Posibles | Imposibles |
| Múltiples instancias | Difícil | Trivial (N instancias del mismo controller) |
| Lifecycle | Hay que llamar super | Automático via addController |
| TypeScript | Tipado complejo | Tipado simple |

## Los 3 controllers del ejemplo

### ClockController
- `hostConnected` → inicia `setInterval`
- `hostDisconnected` → limpia con `clearInterval`
- `host.requestUpdate()` → pide re-render cada segundo

### MouseController
- `hostConnected` → `addEventListener('mousemove')`
- `hostDisconnected` → `removeEventListener`
- Actualiza `x`, `y` y pide re-render

### FetchController\<T\>
- `hostConnected` → lanza fetch automáticamente
- `hostDisconnected` → cancela fetch con `AbortController`
- Expone `data`, `loading`, `error`
- Método `fetch()` público para recargar

## Cómo ejecutar

```bash
npm run dev
```

Mueve el ratón para ver MouseController en acción. Pulsa "Recargar" para ver FetchController.

## Siguiente paso

```bash
git checkout 11-decoradores-avanzados
```
