# 02 — Primer componente

> Rama: `02-primer-componente` | Anterior: `01-setup` | [Índice](../../tree/main)

## Qué hemos hecho

Crear nuestro primer componente Lit: `<my-greeting>`.

## Comparativa Stencil vs Lit

### Definición del componente

**Stencil:**
```tsx
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-greeting',
  shadow: true,
  styleUrl: 'my-greeting.css',
})
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

  static styles = css`...`;

  render() {
    return html`<p>Hola, <span class="highlight">${this.name}</span>!</p>`;
  }
}
```

## Diferencias clave

| Aspecto | Stencil | Lit |
|---------|---------|-----|
| **Clase base** | Clase simple (el compilador hace la magia) | Extiende `LitElement` |
| **Registro del tag** | `@Component({ tag: '...' })` | `@customElement('...')` |
| **Propiedades** | `@Prop()` | `@property()` |
| **Template** | JSX (`<p>{this.name}</p>`) | Tagged template (`` html`<p>${this.name}</p>` ``) |
| **Estilos** | Archivo `.css` separado | `static styles = css`...`` inline |
| **Shadow DOM** | `shadow: true` en decorador | Activado por defecto en `LitElement` |

## Anatomía de un componente Lit

1. **Imports**: `LitElement`, `html`, `css` desde `'lit'` y decoradores desde `'lit/decorators.js'`
2. **`@customElement('tag-name')`**: Registra el componente en el Custom Elements Registry
3. **`extends LitElement`**: Hereda toda la reactividad y Shadow DOM
4. **`@property()`**: Declara propiedades reactivas (cambio → re-render automático)
5. **`static styles`**: Estilos encapsulados en Shadow DOM
6. **`render()`**: Devuelve el template con `html`...``

## Cómo ejecutar

```bash
npm run dev
```

Abre el navegador y verás dos instancias del componente:
- `<my-greeting>` → "Hola, Mundo!"
- `<my-greeting name="Lit">` → "Hola, Lit!"

## Siguiente paso

```bash
git checkout 03-propiedades-estado
```
