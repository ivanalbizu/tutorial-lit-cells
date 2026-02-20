# 09 — Slots y composición

> Rama: `09-slots` | Anterior: `08-directivas` | [Índice](../../tree/main)

## Qué hemos hecho

Un acordeón (`<my-accordion-item>`) y un demo (`<my-slot-demo>`) que demuestran slots, named slots, fallback content y slotchange.

## Slots: Stencil vs Lit

**Los slots son idénticos** — es API estándar de Shadow DOM. La única diferencia es la sintaxis del template.

### Default slot

```tsx
// Stencil (JSX)
render() {
  return <div><slot /></div>;
}

// Lit
render() {
  return html`<div><slot></slot></div>`;
}

// Uso (idéntico en ambos)
<my-comp>
  <p>Este contenido va al slot default</p>
</my-comp>
```

### Named slots

```tsx
// Stencil (JSX)
render() {
  return (
    <div>
      <slot name="header" />
      <slot />
      <slot name="footer" />
    </div>
  );
}

// Lit
render() {
  return html`
    <div>
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
  `;
}

// Uso (idéntico en ambos)
<my-comp>
  <h2 slot="header">Título</h2>
  <p>Contenido default</p>
  <span slot="footer">Pie</span>
</my-comp>
```

### Fallback content

Contenido dentro de `<slot>` que se muestra solo si no se proyecta nada:

```html
<slot name="extra">
  <p>Este texto se ve solo si nadie pasa contenido</p>
</slot>
```

Funciona igual en Stencil y Lit.

## Estilizar contenido proyectado: ::slotted()

```css
/* Solo hijos directos del slot */
::slotted(p) {
  margin: 0.5rem 0;
}

::slotted([slot="icon"]) {
  margin-right: 0.5rem;
}

::slotted(.highlight) {
  background: rgba(100, 108, 255, 0.2);
}
```

**Limitación importante:** `::slotted()` solo puede estilizar **hijos directos** del slot, no nietos. Esto es una limitación del Shadow DOM, no de Lit ni de Stencil.

## Evento slotchange

Se dispara cuando el contenido asignado a un slot cambia (elementos añadidos/quitados).

```ts
// En el template
html`<slot @slotchange=${this._onSlotChange}></slot>`

// Handler
private _onSlotChange(e: Event) {
  const slot = e.target as HTMLSlotElement;
  const nodes = slot.assignedNodes({ flatten: true });
  const elements = nodes.filter(n => n.nodeType === Node.ELEMENT_NODE);
  console.log(`${elements.length} elementos asignados`);
}
```

En Stencil se haría igual con `onSlotchange` en JSX o con `@Listen('slotchange')`.

### Métodos útiles de HTMLSlotElement

| Método | Qué devuelve |
|--------|-------------|
| `slot.assignedNodes()` | Nodos asignados (texto + elementos) |
| `slot.assignedNodes({ flatten: true })` | Incluye fallback si no hay nada asignado |
| `slot.assignedElements()` | Solo elementos (sin nodos de texto) |

## Light DOM vs Shadow DOM

```
<my-comp>                    ← Light DOM (del padre)
  <p slot="header">Hola</p> ← Light DOM (proyectado)
  <p>Contenido</p>          ← Light DOM (proyectado)
</my-comp>

#shadow-root                 ← Shadow DOM (del componente)
  <slot name="header">      ← Punto de inserción
    → <p>Hola</p>           ← Contenido proyectado
  </slot>
  <slot>
    → <p>Contenido</p>
  </slot>
```

El contenido sigue **perteneciendo al Light DOM** del padre — el slot solo es un punto de inserción. Por eso `::slotted()` tiene limitaciones.

## Cómo ejecutar

```bash
npm run dev
```

## Siguiente paso

```bash
git checkout 10-reactive-controllers
```
