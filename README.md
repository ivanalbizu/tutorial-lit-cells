# 03 — Propiedades y estado

> Rama: `03-propiedades-estado` | Anterior: `02-primer-componente` | [Índice](../../tree/main)

## Qué hemos hecho

Dos componentes nuevos que demuestran `@property()` y `@state()`.

## Conceptos clave

### @property() → Equivalente a @Prop() en Stencil

Es una propiedad **pública** que puede establecerse desde fuera del componente.

```ts
// Stencil
@Prop() label: string = 'Hola';
@Prop({ mutable: true }) count: number = 0;

// Lit
@property({ type: String }) label = 'Hola';
@property({ type: Number }) count = 0;
```

**Diferencias importantes:**
- En Stencil necesitas `mutable: true` para poder cambiarla internamente. En Lit **todas las properties son mutables** por defecto.
- En Stencil, `@Prop()` infiere el tipo del TypeScript. En Lit, **debes indicar `type`** explícitamente para que la conversión atributo → propiedad funcione.

### @state() → Equivalente a @State() en Stencil

Es una propiedad **privada** que solo se usa internamente.

```ts
// Stencil
@State() count: number = 0;

// Lit
@state()
private _count = 0;
```

**Comportamiento idéntico**: un cambio en `@state()` dispara un re-render, igual que en Stencil.

### Tipos de propiedades

| Tipo | Atributo HTML | Conversión Lit |
|------|--------------|----------------|
| `String` | `name="Ana"` | Directo |
| `Number` | `age="28"` | `Number("28")` → `28` |
| `Boolean` | `active` (presente/ausente) | Presente → `true`, ausente → `false` |
| `Object` | No se usa por atributo | Solo via JS: `el.data = {...}` |
| `Array` | No se usa por atributo | Solo via JS: `el.items = [...]` |

### Eventos en templates: @click

```ts
// Stencil (JSX)
<button onClick={() => this.increment()}>+</button>

// Lit (tagged template)
<button @click=${this._increment}>+</button>
```

Nota: en Lit usas `@evento` (prefijo `@`) y pasas la referencia a la función directamente, sin arrow function wrapper (Lit hace el bind automáticamente al componente).

## Componentes de esta rama

### `<my-counter>`
- `label` (@property) — Texto del título
- `step` (@property) — Incremento/decremento
- `_count` (@state) — Valor actual (interno)

### `<my-user-card>`
- `name` (@property String)
- `age` (@property Number)
- `active` (@property Boolean, reflect)
- `_showDetails` (@state) — Toggle interno

## Cómo ejecutar

```bash
npm run dev
```

## Siguiente paso

```bash
git checkout 04-templates-binding
```
