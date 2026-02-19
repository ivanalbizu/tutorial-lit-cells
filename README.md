# Tutorial Lit + Cells (viniendo de Stencil)

Tutorial paso a paso para aprender **Lit** y **Cells**, aprovechando conocimientos previos de **Stencil**.

## Estructura del tutorial

Cada paso está en una rama independiente. Navega entre ellas con `git checkout <rama>`.

### Fase 1 — Fundamentos de Lit

| Rama | Tema | Conceptos |
|------|------|-----------|
| `01-setup` | Setup del proyecto | Vite + Lit + TypeScript |
| `02-primer-componente` | Primer componente | `@customElement`, `render()`, equivalencias con Stencil |
| `03-propiedades-estado` | Propiedades y estado | `@property`, `@state`, reactividad |
| `04-templates-binding` | Templates y binding | Tagged templates, condicionales, listas |
| `05-eventos` | Eventos y comunicación | `dispatchEvent`, event listeners, padre-hijo |
| `06-ciclo-de-vida` | Ciclo de vida | `connectedCallback`, `firstUpdated`, `updated` |
| `07-estilos` | Estilos encapsulados | `static styles`, `css` tag, Shadow DOM |

### Fase 2 — Lit Intermedio

| Rama | Tema | Conceptos |
|------|------|-----------|
| `08-directivas` | Directivas | `repeat`, `classMap`, `when`, `guard` |
| `09-slots` | Slots y composición | `<slot>`, named slots, slotchange |
| `10-reactive-controllers` | Reactive Controllers | Lógica reutilizable |
| `11-decoradores-avanzados` | Decoradores avanzados | `@query`, `@queryAll` |

### Fase 3 — Cells

| Rama | Tema | Conceptos |
|------|------|-----------|
| `12-intro-cells` | Introducción a Cells | Arquitectura, scaffold |
| `13-lit-en-cells` | Lit dentro de Cells | Integración componentes |
| `14-routing-cells` | Routing | Navegación entre páginas |
| `15-estado-cells` | Estado compartido | Comunicación entre cells |

### Fase 4 — Proyecto práctico

| Rama | Tema | Conceptos |
|------|------|-----------|
| `16-proyecto-final` | Mini app completa | Todo lo aprendido |

## Cómo usar este tutorial

```bash
# Ver todas las ramas disponibles
git branch -a

# Ir a un paso concreto
git checkout 01-setup

# Volver al índice
git checkout main
```

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
| CSS en archivo separado | `static styles = css`...`` |
