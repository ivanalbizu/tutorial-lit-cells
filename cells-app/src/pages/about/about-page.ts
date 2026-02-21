import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('about-page')
export class AboutPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: #646cff;
      margin-bottom: 1rem;
    }

    p {
      color: #ccc;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #333;
      color: #ccc;
    }

    li::before {
      content: '▸ ';
      color: #646cff;
    }
  `;

  render() {
    return html`
      <h1>About</h1>
      <p>Esta app demuestra cómo funciona Open Cells con Lit.</p>

      <h3>Stack tecnológico</h3>
      <ul>
        <li>Lit 3 — Web Components reactivos</li>
        <li>Open Cells — Orquestador de micro-frontends</li>
        <li>Vite — Build tool</li>
        <li>TypeScript — Tipado estático</li>
      </ul>
    `;
  }
}
