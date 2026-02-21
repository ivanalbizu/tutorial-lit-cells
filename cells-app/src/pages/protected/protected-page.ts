import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { getInterceptorContext, updateInterceptorContext } from '@open-cells/core';

// ═══════════════════════════════════════════════════════════════
// PÁGINA PROTEGIDA — Solo accesible si isAuthenticated = true
//
// El interceptor en startApp() verifica el contexto antes
// de permitir la navegación. Si isAuthenticated es false,
// redirige a 'login'.
//
// Esta página muestra los datos del contexto y permite
// hacer logout (resetear isAuthenticated).
// ═══════════════════════════════════════════════════════════════

@customElement('protected-page')
export class ProtectedPage extends LitElement {
  pageController = new PageController(this);

  @state()
  private _user = '';

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    h1 { color: #4caf50; margin-bottom: 0.5rem; }

    .welcome {
      padding: 1.5rem;
      background: #1a3a1a;
      border: 1px solid #2a5a2a;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .welcome p {
      color: #aaa;
      margin: 0.5rem 0;
    }

    .welcome strong {
      color: #4caf50;
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
      background: #f44336;
      color: white;
      font-size: 0.9rem;
    }

    button:hover { background: #d32f2f; }

    .info {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #2a2a3e;
      border-radius: 8px;
      font-size: 0.85rem;
      color: #888;
    }

    .info h4 {
      color: #c4c4ff;
      margin: 0 0 0.5rem;
    }
  `;

  onPageEnter() {
    const ctx = getInterceptorContext() as { user?: string };
    this._user = ctx?.user || 'Desconocido';
  }

  private _logout() {
    updateInterceptorContext({ isAuthenticated: false, user: '' });
    this.pageController.navigate('home');
  }

  render() {
    return html`
      <h1>Zona protegida</h1>

      <div class="welcome">
        <p>Bienvenido, <strong>${this._user}</strong></p>
        <p>Has accedido a una ruta protegida por el interceptor.</p>
        <button @click=${this._logout}>Cerrar sesión</button>
      </div>

      <div class="info">
        <h4>Cómo funciona el interceptor</h4>
        <p>
          1. En <code>startApp()</code> se define un <code>interceptor</code><br>
          2. Antes de cada navegación, Cells llama al interceptor<br>
          3. Si retorna <code>{ intercept: true, redirect: 'login' }</code>, redirige<br>
          4. <code>skipNavigations</code> excluye rutas del interceptor (home, login, etc.)
        </p>
      </div>
    `;
  }
}
