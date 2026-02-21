# Tutorial Lit + Cells (viniendo de Stencil)

Tutorial paso a paso para aprender **Lit** y **Cells**, aprovechando conocimientos previos de **Stencil**.

## Cómo usar este tutorial

Cada paso tiene su propia **rama** con código ejecutable. También puedes leer todo el contenido aquí sin cambiar de rama.

```bash
# Ver todas las ramas disponibles
git branch -a

# Ir a un paso concreto (código + README específico)
git checkout 01-setup

# Volver al índice
git checkout main
```

## Índice

### Fase 1 — Fundamentos de Lit

| Rama | Tema | Conceptos |
|------|------|-----------|
| `01-setup` | [Setup del proyecto](#01--setup-del-proyecto) | Vite + Lit + TypeScript |
| `02-primer-componente` | [Primer componente](#02--primer-componente) | `@customElement`, `render()` |
| `03-propiedades-estado` | [Propiedades y estado](#03--propiedades-y-estado) | `@property`, `@state` |
| `04-templates-binding` | [Templates y binding](#04--templates-y-binding) | Tagged templates, condicionales, listas |
| `05-eventos` | [Eventos y comunicación](#05--eventos-y-comunicación) | `dispatchEvent`, padre-hijo |
| `06-ciclo-de-vida` | [Ciclo de vida](#06--ciclo-de-vida) | `connectedCallback`, `firstUpdated`, `updated` |
| `07-estilos` | [Estilos encapsulados](#07--estilos-encapsulados) | `static styles`, `:host`, `::part()` |

### Fase 2 — Lit Intermedio

| Rama | Tema | Conceptos |
|------|------|-----------|
| `08-directivas` | [Directivas](#08--directivas) | `repeat`, `classMap`, `when`, `guard` |
| `09-slots` | [Slots y composición](#09--slots-y-composición) | `<slot>`, named slots, slotchange |
| `10-reactive-controllers` | [Reactive Controllers](#10--reactive-controllers) | Lógica reutilizable |
| `11-decoradores-avanzados` | [Decoradores avanzados](#11--decoradores-avanzados) | `@query`, `@queryAll` |

### Fase 3 — Cells

| Rama | Tema | Conceptos |
|------|------|-----------|
| `12-intro-cells` | [Introducción a Cells](#12--introducción-a-open-cells) | `startApp()`, arquitectura, scaffold |
| `13-lit-en-cells` | [Lit dentro de Cells](#13--componentes-lit-en-cells) | PageController, navegación |
| `14-routing-cells` | [Routing avanzado](#14--routing-avanzado) | Params dinámicos, interceptor |
| `15-estado-cells` | [Estado compartido](#15--estado-compartido-con-channels) | Channels pub/sub, carrito |

### Fase 4 — Proyecto práctico

| Rama | Tema | Conceptos |
|------|------|-----------|
| `16-proyecto-final` | Mini app completa | Todo lo aprendido |

## Equivalencias rápidas Stencil → Lit

| Stencil | Lit |
|---------|-----|
| `@Component({ tag: 'my-comp' })` | `@customElement('my-comp')` |
| `@Prop()` | `@property()` |
| `@State()` | `@state()` |
| `@Event()` + `EventEmitter` | `this.dispatchEvent(new CustomEvent(...))` |
| `@Listen()` | `@eventOptions()` o listener manual |
| `@Element()` | `this` (ya es el elemento) |
| `@Watch('prop')` | `willUpdate(changedProps)` |
| JSX en `render()` | Tagged template `` html`...` `` |
| CSS en archivo separado | `` static styles = css`...` `` |
| `componentDidLoad()` | `firstUpdated()` |
| `componentDidRender()` | `updated(changedProps)` |
| `componentWillLoad()` | `connectedCallback()` |
| Compilador genera vanilla WC | Runtime puro (sin compilación) |

---

## Fase 1 — Fundamentos de Lit

---

### 01 — Setup del proyecto

> Rama: `01-setup`

Configuración de un proyecto desde cero con **Vite + Lit + TypeScript**.

#### Comparativa con Stencil

| Aspecto | Stencil | Lit + Vite |
|---------|---------|------------|
| Scaffold | `npm init stencil` | Manual con Vite |
| Compilador | Stencil compiler (produce vanilla WC) | No hay compilador — Lit es runtime puro |
| Bundler | Rollup integrado | Vite (esbuild + Rollup) |
| TypeScript | Integrado | Configuración manual (`tsconfig.json`) |
| Dev server | Integrado | Vite dev server (HMR) |

#### Estructura del proyecto

```
tutorial-lit/
├── index.html          ← Punto de entrada HTML
├── package.json        ← Dependencias: lit, vite, typescript
├── tsconfig.json       ← TypeScript con decoradores
├── vite.config.ts      ← Configuración de Vite
└── src/
    └── index.ts        ← Punto de entrada JS
```

#### Puntos clave

1. **Lit es runtime, no compilador.** En Stencil, el compilador transforma tus componentes en Web Components vanilla. En Lit, tu código usa directamente la API de Web Components del navegador.

2. **Decoradores experimentales.** En `tsconfig.json`:
```json
{
  "experimentalDecorators": true,
  "useDefineForClassFields": false
}
```

3. **Vite como dev server** con HMR. En Stencil viene integrado; aquí se configura aparte.

---

### 02 — Primer componente

> Rama: `02-primer-componente`

Primer componente Lit: `<my-greeting>`.

#### Stencil vs Lit

**Stencil:**
```tsx
import { Component, Prop, h } from '@stencil/core';

@Component({ tag: 'my-greeting', shadow: true, styleUrl: 'my-greeting.css' })
export class MyGreeting {
  @Prop() name: string = 'Mundo';
  render() {
    return <p>Hola, <span class="highlight">{this.name}</span>!</p>;
  }
}
```

**Lit:**
```ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-greeting')
export class MyGreeting extends LitElement {
  @property({ type: String, reflect: true })
  name = 'Mundo';

  static styles = css`
    .highlight { color: #646cff; font-weight: bold; }
  `;

  render() {
    return html`<p>Hola, <span class="highlight">${this.name}</span>!</p>`;
  }
}
```

#### Diferencias clave

| Aspecto | Stencil | Lit |
|---------|---------|-----|
| Clase base | Clase simple (compilador hace la magia) | Extiende `LitElement` |
| Registro del tag | `@Component({ tag: '...' })` | `@customElement('...')` |
| Template | JSX (`<p>{this.name}</p>`) | Tagged template (`` html`<p>${this.name}</p>` ``) |
| Estilos | Archivo `.css` separado | `` static styles = css`...` `` inline |
| Shadow DOM | `shadow: true` en decorador | Activado por defecto |

---

### 03 — Propiedades y estado

> Rama: `03-propiedades-estado`

Componentes: `<my-counter>`, `<my-user-card>`.

#### @property() → Equivalente a @Prop()

```ts
// Stencil
@Prop() label: string = 'Hola';
@Prop({ mutable: true }) count: number = 0;

// Lit
@property({ type: String }) label = 'Hola';
@property({ type: Number }) count = 0;
```

**Diferencia importante:** En Stencil necesitas `mutable: true` para cambiar un `@Prop()` internamente. En Lit **todas las properties son mutables**.

#### @state() → Equivalente a @State()

```ts
// Stencil
@State() count: number = 0;

// Lit
@state()
private _count = 0;
```

Comportamiento idéntico: un cambio dispara re-render.

#### Tipos de propiedades

| Tipo | Atributo HTML | Conversión |
|------|--------------|------------|
| `String` | `name="Ana"` | Directo |
| `Number` | `age="28"` | `Number("28")` → `28` |
| `Boolean` | `active` (presente/ausente) | Presente → `true` |
| `Object` / `Array` | No se usa por atributo | Solo via JS |

#### Eventos en templates

```ts
// Stencil (JSX)
<button onClick={() => this.increment()}>+</button>

// Lit
html`<button @click=${this._increment}>+</button>`
```

---

### 04 — Templates y binding

> Rama: `04-templates-binding`

Componente: `<my-task-list>` — lista de tareas con todos los tipos de binding.

#### Los 7 tipos de binding

| # | Tipo | Lit | Stencil (JSX) |
|---|------|-----|---------------|
| 1 | Interpolación | `` ${expr} `` | `{expr}` |
| 2 | Atributo | `src=${url}` | `src={url}` |
| 3 | Propiedad | `.value=${text}` | `value={text}` |
| 4 | Evento | `@click=${fn}` | `onClick={fn}` |
| 5 | Booleano | `?disabled=${bool}` | `disabled={bool}` |
| 6 | Condicional | `cond ? html`...` : nothing` | `cond ? <p>...</p> : null` |
| 7 | Listas | `items.map(i => html`...`)` | `items.map(i => <li>...</li>)` |

#### Resumen de prefijos

| Prefijo | Tipo | Ejemplo |
|---------|------|---------|
| (ninguno) | Atributo | `src=${url}` |
| `.` | Propiedad JS | `.value=${text}` |
| `@` | Evento | `@click=${fn}` |
| `?` | Booleano | `?disabled=${bool}` |

#### Reactividad con arrays

```ts
// ❌ NO dispara re-render
this._tasks.push(newTask);

// ✅ SÍ dispara re-render (nueva referencia)
this._tasks = [...this._tasks, newTask];
```

#### Cuidado: comentarios HTML dentro de templates

Dentro de `` html`...` ``, **todo `${...}` se interpreta como interpolación**, incluso en comentarios HTML. Si necesitas documentar con ejemplos, usa comentarios TypeScript fuera del template.

---

### 05 — Eventos y comunicación

> Rama: `05-eventos`

Componentes: `<my-rating>` (hijo) + `<my-review>` (padre).

#### Emitir eventos

**Stencil:**
```tsx
@Event() ratingChanged: EventEmitter<number>;
this.ratingChanged.emit(3);
```

**Lit:**
```ts
this.dispatchEvent(new CustomEvent('rating-changed', {
  detail: { value: 3 },
  bubbles: true,      // sube por el DOM
  composed: true,     // cruza Shadow DOM
}));
```

Más explícito, pero es **API estándar** del navegador.

#### Escuchar eventos

**En el template (padre escucha al hijo):**
```ts
// Stencil (JSX)
<my-rating onRatingChanged={(e) => this.handleRating(e)} />

// Lit
html`<my-rating @rating-changed=${this._onRatingChanged}></my-rating>`
```

**Con decorador (solo Stencil):**
```tsx
// Stencil
@Listen('ratingChanged')
handleRating(e: CustomEvent) { ... }

// Lit — no tiene @Listen, se hace manualmente en connectedCallback
connectedCallback() {
  super.connectedCallback();
  this.addEventListener('rating-changed', this._handler);
}
```

#### Opciones de CustomEvent

| Opción | Default | Para qué |
|--------|---------|----------|
| `bubbles` | `false` | Sube por el árbol DOM |
| `composed` | `false` | Cruza límites del Shadow DOM |
| `detail` | `undefined` | Datos del evento |

**Regla:** Si quieres que el padre escuche el evento → `bubbles: true, composed: true`.

#### Nombres de eventos

- Stencil: camelCase (`ratingChanged`) → se convierte a kebab-case automáticamente
- Lit: usas directamente kebab-case (`rating-changed`)

---

### 06 — Ciclo de vida

> Rama: `06-ciclo-de-vida`

Componentes: `<my-clock>` + `<my-lifecycle-demo>` (montar/desmontar).

#### Tabla completa

| Orden | Stencil | Lit | Cuándo |
|-------|---------|-----|--------|
| 1 | `constructor()` | `constructor()` | Al crear la instancia |
| 2 | `connectedCallback()` | `connectedCallback()` | Al añadir al DOM |
| 3 | `componentWillLoad()` | _(no existe)_ | Antes del primer render |
| 4 | — | `willUpdate(changedProps)` | Antes de cada render |
| 5 | `render()` | `render()` | Genera el template |
| 6 | `componentDidLoad()` | `firstUpdated()` | Después del primer render |
| 7 | `componentDidRender()` | `updated(changedProps)` | Después de cada render |
| 8 | `disconnectedCallback()` | `disconnectedCallback()` | Al quitar del DOM |

#### Reemplazar @Watch()

**Stencil:**
```tsx
@Watch('name')
nameChanged(newVal: string, oldVal: string) {
  console.log(`cambió de ${oldVal} a ${newVal}`);
}
```

**Lit:**
```ts
willUpdate(changedProps: Map<string, unknown>) {
  if (changedProps.has('name')) {
    const oldVal = changedProps.get('name') as string;
    console.log(`cambió de ${oldVal} a ${this.name}`);
  }
}
```

`changedProps.get('prop')` → valor **anterior**. `this.prop` → valor **nuevo**.

#### Reglas importantes

- `super.connectedCallback()` y `super.disconnectedCallback()` son **obligatorios**
- `willUpdate`: puedes modificar estado **sin causar render extra**
- `updated`: modificar estado aquí **sí causa otro render** (cuidado con bucles)
- `firstUpdated`: Shadow DOM ya existe → puedes hacer `querySelector`

---

### 07 — Estilos encapsulados

> Rama: `07-estilos`

Componentes: `<my-card>` + `<my-theme-demo>`.

#### Definición de estilos

**Stencil:**
```tsx
@Component({ styleUrl: 'my-card.css', shadow: true })
```

**Lit:**
```ts
static styles = css`
  :host { display: block; }
`;
```

#### Array de estilos (composición)

```ts
import { baseStyles } from './shared-styles.js';

static styles = [baseStyles, css`
  .header { color: blue; }
`];
```

En Stencil no hay equivalente directo.

#### Selectores Shadow DOM

Funcionan igual en Stencil (con `shadow: true`):

```css
/* El propio elemento */
:host { display: block; }
:host([variant="primary"]) { border-color: blue; }
:host(:hover) { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }

/* Contenido proyectado en <slot> (solo hijos directos) */
::slotted(p) { margin: 0.5rem 0; }

/* Partes expuestas con part="nombre" */
my-card::part(header) { font-style: italic; }
```

#### Personalizar estilos desde fuera del Shadow DOM

| Método | Atraviesa Shadow DOM | Uso |
|--------|---------------------|-----|
| CSS custom properties | Sí | `--card-bg: red` → `var(--card-bg, default)` |
| `::part()` | Sí (partes expuestas) | `my-card::part(header) { ... }` |
| Atributos + `:host([attr])` | Sí | `variant="primary"` |
| Clases CSS externas | **No** | No afectan al Shadow DOM |

Las **variables CSS** son la forma más potente — es la única vía de pasar estilos arbitrarios a través del Shadow DOM.

#### Rendimiento

Lit usa **Constructable Stylesheets** (`adoptedStyleSheets`): 100 instancias de `<my-card>` comparten la misma hoja de estilos en memoria.

---

## Fase 2 — Lit Intermedio

---

### 08 — Directivas

> Rama: `08-directivas`

Componente: `<my-directive-demo>` — lista de personas con todas las directivas.

Stencil no tiene directivas porque usa JSX (JavaScript nativo). En Lit, las directivas controlan cómo se renderizan expresiones dentro de `html`...``.

#### Directivas principales

| Directiva | Equivalente Stencil/JSX | Para qué |
|-----------|------------------------|----------|
| `repeat(items, keyFn, tplFn)` | `key={id}` en listas | Reordenamiento eficiente con keys |
| `classMap({ cls: bool })` | `class={{ cls: bool }}` | Clases condicionales |
| `styleMap({ prop: val })` | `style={{ prop: val }}` | Estilos inline con objeto |
| `when(cond, trueFn, falseFn)` | Ternario `{cond ? ... : ...}` | Condicional lazy |
| `guard([deps], fn)` | _(no existe)_ | Memoización |
| `ifDefined(val)` | `attr={val \|\| undefined}` | Atributo opcional |
| `live(val)` | _(no existe)_ | Sincronizar con DOM real |

```ts
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
```

---

### 09 — Slots y composición

> Rama: `09-slots`

Componentes: `<my-accordion-item>` + `<my-slot-demo>`.

Los slots son **idénticos** en Stencil y Lit — es API estándar de Shadow DOM.

```html
<!-- Default slot -->
<slot></slot>

<!-- Named slot -->
<slot name="header"></slot>

<!-- Fallback content -->
<slot name="extra">
  <p>Se muestra si nadie pasa contenido</p>
</slot>
```

#### Estilizar contenido proyectado

```css
::slotted(p) { margin: 0.5rem 0; }
```

Limitación: `::slotted()` solo estiliza **hijos directos**, no nietos.

#### slotchange

Solo se dispara cuando cambia el **Light DOM** asignado al slot (hijos del padre), no cuando cambia el Shadow DOM interno del componente.

---

### 10 — Reactive Controllers

> Rama: `10-reactive-controllers`

Controllers: `ClockController`, `MouseController`, `FetchController<T>`.

Lógica reutilizable que participa en el ciclo de vida. **Stencil no tiene equivalente** — lo más cercano son mixins o servicios (sin acceso al lifecycle).

```ts
import { ReactiveController, ReactiveControllerHost } from 'lit';

export class ClockController implements ReactiveController {
  host: ReactiveControllerHost;
  value = new Date();

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() { /* iniciar timer */ }
  hostDisconnected() { /* limpiar timer */ }
}
```

Uso en componente:
```ts
private _clock = new ClockController(this);
// No hace falta connectedCallback/disconnectedCallback
```

| Framework | Equivalente |
|-----------|-------------|
| Lit | Reactive Controllers |
| React | Custom Hooks |
| Angular | Services con lifecycle |
| Vue | Composables |

---

### 11 — Decoradores avanzados

> Rama: `11-decoradores-avanzados`

Componente: `<my-form-demo>` — formulario con acceso declarativo al DOM.

| Decorador | Stencil | Para qué |
|-----------|---------|----------|
| `@query('#id')` | `this.el.shadowRoot.querySelector()` | Acceso a elemento |
| `@queryAll('.cls')` | `this.el.shadowRoot.querySelectorAll()` | Acceso a múltiples |
| `@queryAsync('#id')` | _(no existe)_ | querySelector que espera al render |

```ts
@query('#name-input')
private _nameInput!: HTMLInputElement;

// Uso directo (sin querySelector)
this._nameInput.focus();
this._nameInput.value = '';
```

En Stencil usarías: `this.el.shadowRoot.querySelector('#name-input')`. En Lit, `@query` es declarativo y con cache automático.

---

## Fase 3 — Open Cells

---

### 12 — Introducción a Open Cells

> Rama: `12-intro-cells`

**Open Cells** es un framework de micro-frontends de BBVA, construido sobre web components estándar.

#### ¿Qué hace Open Cells?

1. **Routing** — Navegación basada en hash (`#!/ruta`)
2. **Orquestación de páginas** — Cada página es un web component independiente
3. **Estado compartido** — Sistema pub/sub con canales (channels)
4. **Lazy loading** — Las páginas se cargan bajo demanda

#### startApp() — Bootstrap

```typescript
import { startApp } from '@open-cells/core';
import { routes } from '../router/routes.js';

startApp({
  routes,                    // Array de rutas
  mainNode: 'app-content',  // ID del elemento contenedor
});
```

#### Definición de rutas

```typescript
export const routes = [
  {
    path: '/',
    name: 'home',
    component: 'home-page',
    action: async () => { await import('../pages/home/home-page.js'); },
  },
  // ...
];
```

Cada ruta tiene: `path`, `name`, `component`, `action` (lazy loading), y opcionalmente `notFound`.

#### Paquetes

| Paquete | Función |
|---|---|
| `@open-cells/core` | Router, `startApp()`, channels, navegación |
| `@open-cells/page-controller` | Reactive Controller para páginas |
| `@open-cells/element-controller` | Controller base para cualquier componente |

---

### 13 — Componentes Lit en Cells

> Rama: `13-lit-en-cells`

#### Componentes compartidos vs páginas

Los componentes compartidos (como un header) se colocan **fuera** del `mainNode`:

```html
<app-header></app-header>          <!-- Persistente -->
<div id="app-content"></div>       <!-- Cells monta/desmonta páginas aquí -->
```

#### PageController

`PageController` es un Reactive Controller (como los de la rama 10) específico para páginas de Cells:

```typescript
@customElement('demo-page')
export class DemoPage extends LitElement {
  pageController = new PageController(this);

  onPageEnter() { /* página visible */ }
  onPageLeave() { /* página oculta */ }

  render() {
    return html`
      <button @click=${() => this.pageController.navigate('home')}>
        Ir a Home
      </button>
    `;
  }
}
```

#### Navegación global

Para componentes que no son páginas:

```typescript
import { navigate } from '@open-cells/core';
navigate('about');
```

| Concepto | Open Cells | Stencil |
|---|---|---|
| Navegación en página | `pageController.navigate('name')` | `this.history.push('/path')` |
| Navegación global | `navigate('name')` | `<stencil-route-link>` |
| Lifecycle de página | `onPageEnter()` / `onPageLeave()` | No existe |

---

### 14 — Routing avanzado

> Rama: `14-routing-cells`

#### Parámetros dinámicos

```typescript
// Ruta
{ path: '/product/:id', name: 'product', component: 'product-page', ... }

// Navegar con parámetros
pageController.navigate('product', { id: '42' });
// → URL: #!/product/42
```

#### Interceptor (auth guard)

```typescript
startApp({
  routes,
  mainNode: 'app-content',

  interceptor: (navigation, ctx) => {
    if (!ctx.isAuthenticated) {
      return { intercept: true, redirect: 'login' };
    }
    return { intercept: false, redirect: '' };
  },

  skipNavigations: ['home', 'about', 'login'],
});
```

#### Gestión del contexto

```typescript
import { updateInterceptorContext, getInterceptorContext } from '@open-cells/core';

// Login
updateInterceptorContext({ isAuthenticated: true, user: 'Juan' });

// Logout
updateInterceptorContext({ isAuthenticated: false });

// Leer
const ctx = getInterceptorContext();
```

| Concepto | Open Cells | Angular | React | Stencil |
|---|---|---|---|---|
| Params | `/product/:id` | `:id` en Route | `useParams` | `@Prop() match` |
| Guard | `interceptor` | `CanActivate` | `<ProtectedRoute>` | No nativo |
| Contexto auth | `updateInterceptorContext()` | Service | Context/Redux | Store manual |

---

### 15 — Estado compartido con Channels

> Rama: `15-estado-cells`

#### Channels — Pub/Sub global

```typescript
// Suscribirse
this.pageController.subscribe('ch-cart', (items) => {
  this._items = items;
});

// Publicar
this.pageController.publish('ch-cart', updatedItems);

// Desuscribirse
this.pageController.unsubscribe('ch-cart');
```

#### Patrón típico

```typescript
onPageEnter() {
  this.pageController.subscribe('ch-cart', (items) => {
    this._items = [...items];
  });
}

onPageLeave() {
  this.pageController.unsubscribe('ch-cart');
}
```

#### Flujo del carrito de compras

1. `product-page` publica el carrito actualizado en `'ch-cart'`
2. `cart-page` está suscrita y se actualiza automáticamente
3. Cualquier componente puede publicar/suscribirse al mismo canal

| Concepto | Open Cells | React | Angular | Vue | Stencil |
|---|---|---|---|---|---|
| Estado global | Channels (pub/sub) | Context/Redux | Services + RxJS | Pinia | Stencil Store |
| Suscripción | `subscribe(ch, cb)` | `useSelector()` | `.subscribe()` | `store.state` | `onChange()` |
| Publicación | `publish(ch, data)` | `dispatch()` | `.next()` | `store.action()` | `state.prop = val` |

#### Ventajas

- **Desacoplado** — Las páginas no se conocen entre sí
- **Global** — Cualquier componente puede participar
- **Simple** — No requiere store, reducers, ni boilerplate
- **Lifecycle-aware** — Se limpia con `onPageLeave`
