# 05 — Eventos y comunicación

> Rama: `05-eventos` | Anterior: `04-templates-binding` | [Índice](../../tree/main)

## Qué hemos hecho

Comunicación padre-hijo mediante `CustomEvent`, con dos componentes:
- `<my-rating>` (hijo) — emite `rating-changed`
- `<my-review>` (padre) — escucha el evento y gestiona las reviews

## Emitir eventos: Stencil vs Lit

### Stencil

```tsx
import { Event, EventEmitter } from '@stencil/core';

@Event() ratingChanged: EventEmitter<number>;

// Emitir
this.ratingChanged.emit(3);
```

Stencil crea el `CustomEvent` por ti, con `bubbles` y `composed` automáticos.

### Lit

```ts
// No hay decorador — usas la API nativa del navegador
this.dispatchEvent(new CustomEvent('rating-changed', {
  detail: { value: 3 },
  bubbles: true,
  composed: true,
}));
```

Más explícito, pero es **API estándar** — no necesitas importar nada de Lit.

## Escuchar eventos: Stencil vs Lit

### En el template (padre escucha al hijo)

```tsx
// Stencil (JSX)
<my-rating onRatingChanged={(e) => this.handleRating(e)} />

// Lit
html`<my-rating @rating-changed=${this._onRatingChanged}></my-rating>`
```

### Con decorador (Stencil only)

```tsx
// Stencil — escucha en el propio componente o en window/document
@Listen('ratingChanged')
handleRating(e: CustomEvent<number>) { ... }

// Lit — no tiene @Listen, se hace manualmente:
connectedCallback() {
  super.connectedCallback();
  this.addEventListener('rating-changed', this._handler);
}
disconnectedCallback() {
  super.disconnectedCallback();
  this.removeEventListener('rating-changed', this._handler);
}
```

### Desde JavaScript vanilla

```js
// Funciona igual en ambos — son CustomEvents estándar
document.addEventListener('rating-changed', (e) => {
  console.log(e.detail.value);
});
```

## Opciones de CustomEvent

| Opción | Default | Para qué sirve |
|--------|---------|----------------|
| `bubbles` | `false` | El evento sube por el árbol DOM (como `click`) |
| `composed` | `false` | El evento cruza los límites del Shadow DOM |
| `detail` | `undefined` | Datos que acompañan al evento |

**Regla práctica:** Si quieres que el padre pueda escuchar el evento, usa siempre `bubbles: true, composed: true`.

## Nombres de eventos

| Stencil | Lit / Nativo |
|---------|--------------|
| `@Event() ratingChanged` (camelCase) | `'rating-changed'` (kebab-case) |
| Se auto-convierte a kebab en el DOM | Tú controlas el nombre directamente |

## Flujo de comunicación

```
[my-rating]  →  dispatchEvent('rating-changed')
                        ↓ bubbles + composed
[my-review]  →  @rating-changed=${this._handler}
                        ↓ bubbles + composed
[document]   →  addEventListener('rating-changed', ...)
```

## Cómo ejecutar

```bash
npm run dev
```

Haz click en las estrellas y observa:
1. El padre `<my-review>` actualiza su estado
2. El log de eventos en la parte inferior captura todo

## Siguiente paso

```bash
git checkout 06-ciclo-de-vida
```
