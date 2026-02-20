# 04 — Templates y binding

> Rama: `04-templates-binding` | Anterior: `03-propiedades-estado` | [Índice](../../tree/main)

## Qué hemos hecho

Un componente `<my-task-list>` que demuestra **todos los tipos de binding** de Lit.

## Los 7 tipos de binding en Lit

### 1. Interpolación de texto: `${expresion}`

```ts
// Stencil (JSX)
<p>{this.count} tareas</p>

// Lit
html`<p>${this.count} tareas</p>`
```

### 2. Binding de atributo: `attr=${valor}`

```ts
// Stencil (JSX)
<img src={this.url} />

// Lit
html`<img src=${this.url} />`
```

### 3. Binding de propiedad: `.prop=${valor}`

Establece la **propiedad JS** del elemento, no el atributo HTML. Útil para objetos/arrays.

```ts
// Stencil (JSX) — JSX siempre usa propiedades
<input value={this.text} />

// Lit — prefijo . para forzar propiedad
html`<input .value=${this.text} />`
```

### 4. Binding de evento: `@event=${handler}`

```ts
// Stencil (JSX)
<button onClick={() => this.handleClick()}>Click</button>

// Lit — prefijo @
html`<button @click=${this.handleClick}>Click</button>`
```

### 5. Binding booleano: `?attr=${bool}`

Añade o quita un atributo booleano del DOM.

```ts
// Stencil (JSX)
<button disabled={this.isDisabled}>Click</button>

// Lit — prefijo ?
html`<button ?disabled=${this.isDisabled}>Click</button>`
```

### 6. Condicionales

```ts
// Stencil (JSX) — ternario
{this.show ? <p>Visible</p> : null}

// Lit — ternario con nothing (import { nothing } from 'lit')
${this.show ? html`<p>Visible</p>` : nothing}
```

`nothing` es más limpio que `''` o `null` — Lit no renderiza nada en absoluto.

### 7. Listas: `.map()`

```ts
// Stencil (JSX)
{this.items.map(item => <li key={item.id}>{item.text}</li>)}

// Lit
${this.items.map(item => html`<li>${item.text}</li>`)}
```

> Nota: Lit no necesita `key`. Para optimizar listas grandes existe la directiva `repeat()` (lo veremos en la rama 08).

## Resumen de prefijos de binding

| Prefijo | Tipo | Ejemplo | Equivalente Stencil |
|---------|------|---------|---------------------|
| (ninguno) | Atributo | `src=${url}` | `src={url}` |
| `.` | Propiedad | `.value=${text}` | `value={text}` |
| `@` | Evento | `@click=${fn}` | `onClick={fn}` |
| `?` | Booleano | `?disabled=${bool}` | `disabled={bool}` |

## Reactividad con arrays

Igual que en Stencil con `@State`, Lit necesita una **nueva referencia** para detectar cambios en arrays/objetos:

```ts
// ❌ Esto NO dispara re-render
this._tasks.push(newTask);

// ✅ Esto SÍ dispara re-render
this._tasks = [...this._tasks, newTask];
```

## Cómo ejecutar

```bash
npm run dev
```

## Siguiente paso

```bash
git checkout 05-eventos
```
