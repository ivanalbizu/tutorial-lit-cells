import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';

@customElement('about-page')
export class AboutPage extends LitElement {
  pageController = new PageController(this);

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

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
    }

    th, td {
      padding: 0.6rem 0.8rem;
      text-align: left;
      border-bottom: 1px solid #333;
    }

    th {
      color: #c4c4ff;
      font-size: 0.85rem;
    }

    td {
      color: #aaa;
      font-size: 0.9rem;
    }

    code {
      background: #1a1a2e;
      padding: 0.15rem 0.4rem;
      border-radius: 3px;
      color: #4caf50;
      font-size: 0.85em;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
    }

    button:hover { background: #535bf2; }
  `;

  render() {
    return html`
      <h1>About</h1>
      <p>Comparativa de cómo se resuelven los mismos problemas en diferentes frameworks:</p>

      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Open Cells + Lit</th>
            <th>Stencil</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Componentes</td>
            <td><code>LitElement</code></td>
            <td><code>@Component</code></td>
          </tr>
          <tr>
            <td>Routing</td>
            <td><code>startApp({ routes })</code></td>
            <td><code>@stencil/router</code></td>
          </tr>
          <tr>
            <td>Navegación</td>
            <td><code>pageController.navigate()</code></td>
            <td><code>history.push()</code></td>
          </tr>
          <tr>
            <td>Estado global</td>
            <td>Channels (pub/sub)</td>
            <td>Stencil Store</td>
          </tr>
          <tr>
            <td>Lifecycle página</td>
            <td><code>onPageEnter/Leave</code></td>
            <td>No existe</td>
          </tr>
        </tbody>
      </table>

      <button @click=${() => this.pageController.navigate('home')}>
        Volver a Home
      </button>
    `;
  }
}
