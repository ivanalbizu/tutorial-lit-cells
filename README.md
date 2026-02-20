# 11 — Decoradores avanzados

> Rama: `11-decoradores-avanzados` | Anterior: `10-reactive-controllers` | [Índice](../../tree/main)

## Qué hemos hecho

Un formulario (`<my-form-demo>`) que demuestra `@query`, `@queryAll` y `@queryAsync` para acceder a elementos del Shadow DOM de forma declarativa.

## Decoradores de acceso al DOM: Stencil vs Lit

### @Element() → `this`

**Stencil:**
```tsx
@Element() el: HTMLElement;

// Acceder al Shadow DOM
this.el.shadowRoot.querySelector('#my-input');
```

**Lit:**
```ts
// No necesitas @Element() — el componente ES el elemento
this.shadowRoot.querySelector('#my-input');

// O mejor: usa @query (declarativo)
@query('#my-input')
private _myInput!: HTMLInputElement;
```

### @query('#selector') — querySelector

Shortcut declarativo para `this.renderRoot.querySelector()`.

```ts
// Declara (se cachea automáticamente)
@query('#name-input')
private _nameInput!: HTMLInputElement;

// Usa directamente
this._nameInput.focus();
this._nameInput.value = '';
const rect = this._nameInput.getBoundingClientRect();
```

**Stencil no tiene equivalente** — siempre usas `this.el.shadowRoot.querySelector()`.

### @queryAll('.selector') — querySelectorAll

Devuelve un `NodeList` con todos los matches.

```ts
@queryAll('.form-field')
private _allFields!: NodeListOf<HTMLElement>;

// Iterar sobre todos
this._allFields.forEach(field => { ... });
```

### @queryAsync('#selector') — con await

Devuelve una `Promise` que resuelve **después del siguiente render**. Útil para elementos que podrían no existir aún (renderizado condicional).

```ts
@queryAsync('#dynamic-content')
private _dynamicContent!: Promise<HTMLDivElement>;

// Esperar a que exista
async showContent() {
  this._showDynamic = true;  // Dispara render
  const el = await this._dynamicContent;  // Espera a que el DOM se actualice
  el.textContent = 'Listo!';
}
```

## Resumen de decoradores

### Ya conocidos (Fase 1)

| Decorador | Stencil | Para qué |
|-----------|---------|----------|
| `@customElement('tag')` | `@Component({ tag })` | Registrar componente |
| `@property()` | `@Prop()` | Propiedad pública reactiva |
| `@state()` | `@State()` | Estado interno reactivo |

### Nuevos (esta rama)

| Decorador | Stencil | Para qué |
|-----------|---------|----------|
| `@query('#id')` | `this.el.shadowRoot.querySelector()` | Acceso a elemento del Shadow DOM |
| `@queryAll('.cls')` | `this.el.shadowRoot.querySelectorAll()` | Acceso a múltiples elementos |
| `@queryAsync('#id')` | No existe | querySelector que espera al render |

### Otros decoradores de Lit (referencia)

| Decorador | Para qué |
|-----------|----------|
| `@eventOptions({ passive: true })` | Opciones para event listeners |
| `@queryAssignedElements()` | Elementos asignados a un slot |
| `@queryAssignedNodes()` | Nodos asignados a un slot |

## Cuándo usar @query vs otras opciones

| Necesidad | Solución |
|-----------|----------|
| Acceso puntual a un elemento | `@query('#id')` |
| Acceso a varios elementos | `@queryAll('.cls')` |
| Elemento que puede no existir aún | `@queryAsync('#id')` |
| Leer valor de un input | `@query` o evento `@input` |
| Medir dimensiones | `@query` + `getBoundingClientRect()` |
| Focus programático | `@query` + `.focus()` |

## Cómo ejecutar

```bash
npm run dev
```

Prueba: "Focus nombre", "Resaltar todos los campos", "Mostrar contenido dinámico".

## Fase 2 completada

Con esta rama completamos la Fase 2 (Lit Intermedio):

```
08-directivas             → repeat, classMap, styleMap, when, guard
09-slots                  → slot, named slots, slotchange
10-reactive-controllers   → Lógica reutilizable con lifecycle
11-decoradores-avanzados  → @query, @queryAll, @queryAsync
```

## Siguiente paso

```bash
git checkout 12-intro-cells
```
