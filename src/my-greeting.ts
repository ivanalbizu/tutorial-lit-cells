import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * En Stencil harías:
 *
 * @Component({ tag: 'my-greeting', shadow: true })
 * export class MyGreeting {
 *   @Prop() name: string = 'Mundo';
 *   render() {
 *     return <p>Hola, {this.name}!</p>;
 *   }
 * }
 *
 * En Lit es muy similar, pero con tagged template literals en vez de JSX:
 */
@customElement('my-greeting')
export class MyGreeting extends LitElement {
  // Equivalente a @Prop() en Stencil
  // - reflect: true  → el atributo HTML se sincroniza con la propiedad
  // - type: String    → Lit convierte el atributo (siempre string) al tipo indicado
  @property({ type: String, reflect: true })
  name = 'Mundo';

  // En Stencil: static get styles() o archivo .css separado
  // En Lit: static styles con el tag css`...`
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
      padding: 1rem;
      border: 2px solid #646cff;
      border-radius: 8px;
      max-width: 400px;
    }

    p {
      margin: 0;
      font-size: 1.5rem;
    }

    .highlight {
      color: #646cff;
      font-weight: bold;
    }
  `;

  // render() funciona igual que en Stencil, pero usa html`...` en vez de JSX
  render() {
    return html`
      <p>Hola, <span class="highlight">${this.name}</span>!</p>
    `;
  }
}
