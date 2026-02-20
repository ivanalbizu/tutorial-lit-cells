# 07 — Estilos encapsulados

> Rama: `07-estilos` | Anterior: `06-ciclo-de-vida` | [Índice](../../tree/main)

## Qué hemos hecho

Dos componentes que demuestran el sistema de estilos de Lit:
- `<my-card>` — Componente estilizado con variantes, slots y `part`
- `<my-theme-demo>` — Personaliza `my-card` desde fuera con CSS custom properties y `::part()`

## Estilos: Stencil vs Lit

### Definición de estilos

**Stencil:**
```tsx
@Component({
  tag: 'my-card',
  styleUrl: 'my-card.css',   // archivo separado
  shadow: true,
})
```

**Lit:**
```ts
@customElement('my-card')
export class MyCard extends LitElement {
  static styles = css`
    :host { display: block; }
  `;
}
```

### Array de estilos (composición)

```ts
// Estilos compartidos (en un archivo aparte)
export const baseStyles = css`
  :host { display: block; box-sizing: border-box; }
`;

// Componente que los usa
static styles = [baseStyles, css`
  .header { color: blue; }
`];
```

En Stencil no hay equivalente directo — usarías CSS imports o preprocesadores.

## Selectores especiales del Shadow DOM

Todos funcionan igual en Stencil (con `shadow: true`):

### `:host` — El propio elemento

```css
:host {
  display: block;
  padding: 1rem;
}

:host([variant="primary"]) {
  border-color: blue;
}

:host(:hover) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
```

### `::slotted()` — Contenido proyectado en slots

```css
::slotted(p) {
  margin: 0.5rem 0;
}

::slotted([slot="footer"]) {
  border-top: 1px solid #ccc;
}
```

**Limitación:** `::slotted()` solo puede estilizar hijos directos, no nietos.

### `::part()` — Partes expuestas desde dentro

**Dentro del componente (exponer):**
```html
<div part="header">...</div>
```

**Desde fuera (estilizar):**
```css
my-card::part(header) {
  font-style: italic;
}
```

## Formas de personalizar estilos desde fuera

| Método | Atraviesa Shadow DOM | Ejemplo |
|--------|---------------------|---------|
| CSS custom properties | Sí | `--card-bg: red` |
| `::part()` | Sí (solo partes expuestas) | `my-card::part(header) { ... }` |
| Atributos + `:host([attr])` | Sí (el componente debe soportarlo) | `variant="primary"` |
| Clases CSS externas | No | No afectan al Shadow DOM |

### CSS Custom Properties (la más potente)

Las variables CSS son la **única forma** de pasar estilos arbitrarios a través del Shadow DOM. Funcionan igual en Stencil.

```css
/* Padre define */
my-card { --card-bg: #1e1e3a; }

/* Hijo consume con fallback */
:host { background: var(--card-bg, #2a2a3e); }
```

## Rendimiento

Lit usa **Constructable Stylesheets** (`adoptedStyleSheets`): si tienes 100 instancias de `<my-card>`, todas comparten la **misma hoja de estilos** en memoria.

## Cómo ejecutar

```bash
npm run dev
```

## Siguiente paso

```bash
git checkout 08-directivas
```
