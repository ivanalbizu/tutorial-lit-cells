# 08 — Directivas

> Rama: `08-directivas` | Anterior: `07-estilos` | [Índice](../../tree/main)

## Qué hemos hecho

Un componente `<my-directive-demo>` que demuestra las directivas más usadas de Lit en un solo ejemplo: una lista de personas editable.

## ¿Qué son las directivas?

Stencil no tiene directivas porque usa **JSX**, donde todo es JavaScript nativo. En Lit, las directivas son **funciones especiales** que se usan dentro de `html`...`` para controlar cómo se renderizan las expresiones.

Son el equivalente Lit a los patrones comunes de JSX.

## Directivas principales

### repeat(items, keyFn, templateFn)

Renderiza listas con **keys** para reordenamiento eficiente.

```ts
import { repeat } from 'lit/directives/repeat.js';

// Stencil (JSX) — key es nativo
{this.items.map(item => <li key={item.id}>{item.name}</li>)}

// Lit — sin repeat (reutiliza por posición)
${this.items.map(item => html`<li>${item.name}</li>`)}

// Lit — con repeat (reutiliza por key, como React/Stencil)
${repeat(this.items, (item) => item.id, (item) => html`<li>${item.name}</li>`)}
```

**Cuándo usar `repeat`:**
- La lista cambia de **orden** (sort, shuffle)
- Los items tienen **estado interno** (inputs, animaciones)
- Se hacen **inserciones/eliminaciones** frecuentes en medio de la lista

**Cuándo `.map()` es suficiente:**
- Lista estática o que solo crece al final
- No hay estado interno en los items

### classMap({ clase: condición })

Aplica clases condicionalmente con un objeto.

```ts
import { classMap } from 'lit/directives/class-map.js';

// Stencil (JSX)
<span class={{ active: this.isActive, disabled: this.isDisabled }}>

// Lit
html`<span class=${classMap({
  active: this.isActive,
  disabled: this.isDisabled,
})}>`
```

### styleMap({ propiedad: valor })

Aplica estilos inline con un objeto.

```ts
import { styleMap } from 'lit/directives/style-map.js';

// Stencil (JSX)
<div style={{ backgroundColor: this.color, fontSize: '16px' }}>

// Lit
html`<div style=${styleMap({
  backgroundColor: this.color,
  fontSize: '16px',
})}>`
```

Nota: usa camelCase (`backgroundColor`) no kebab-case.

### when(condición, trueCase, falseCase)

Alternativa más legible al ternario.

```ts
import { when } from 'lit/directives/when.js';

// Ternario clásico
${this.show ? html`<p>Visible</p>` : html`<p>Oculto</p>`}

// when() — las funciones son lazy (no se evalúan si no se necesitan)
${when(this.show,
  () => html`<p>Visible</p>`,
  () => html`<p>Oculto</p>`
)}
```

### guard([deps], () => template)

Memoización: solo re-evalúa si las dependencias cambian.

```ts
import { guard } from 'lit/directives/guard.js';

// Se recalcula en CADA render
${this.computeExpensiveHTML()}

// Solo se recalcula si this.items cambia
${guard([this.items], () => this.computeExpensiveHTML())}
```

No tiene equivalente en Stencil — lo más cercano sería memoización manual o `@Watch`.

### ifDefined(valor)

Si el valor es `undefined`, el atributo NO se añade al DOM.

```ts
import { ifDefined } from 'lit/directives/if-defined.js';

// Stencil (JSX)
<img src={this.url || undefined} />

// Lit
html`<img src=${ifDefined(this.url)} />`
```

Útil para atributos opcionales: `src`, `href`, `aria-*`, `title`.

### live(valor)

Compara contra el valor **real del DOM**, no contra el último valor renderizado por Lit.

```ts
import { live } from 'lit/directives/live.js';

// Sin live: Lit compara con su cache interno
html`<input .value=${this.text} />`

// Con live: Lit compara con input.value del DOM real
html`<input .value=${live(this.text)} />`
```

Útil cuando el usuario puede modificar un input y quieres forzar sincronización.

## Resumen: Stencil (JSX) → Lit (directivas)

| Patrón en Stencil/JSX | Directiva Lit | Import |
|------------------------|---------------|--------|
| `key={id}` en listas | `repeat(items, keyFn, tplFn)` | `lit/directives/repeat.js` |
| `class={{ a: true }}` | `classMap({ a: true })` | `lit/directives/class-map.js` |
| `style={{ color: 'red' }}` | `styleMap({ color: 'red' })` | `lit/directives/style-map.js` |
| Ternario `{cond ? ... : ...}` | `when(cond, trueFn, falseFn)` | `lit/directives/when.js` |
| Memoización manual | `guard([deps], fn)` | `lit/directives/guard.js` |
| `attr={val \|\| undefined}` | `ifDefined(val)` | `lit/directives/if-defined.js` |
| — | `live(val)` | `lit/directives/live.js` |

## Cómo ejecutar

```bash
npm run dev
```

Prueba a reordenar, añadir y eliminar personas para ver `repeat` en acción. Haz click en una persona para ver `when` + `live`.

## Siguiente paso

```bash
git checkout 09-slots
```
