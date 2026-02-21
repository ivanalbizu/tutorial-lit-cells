import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('not-found-page')
export class NotFoundPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      font-size: 4rem;
      color: #f44336;
      margin-bottom: 0.5rem;
    }

    p {
      color: #aaa;
      font-size: 1.1rem;
    }
  `;

  render() {
    return html`
      <h1>404</h1>
      <p>Página no encontrada</p>
    `;
  }
}
