import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { updateInterceptorContext } from '@open-cells/core';

// ═══════════════════════════════════════════════════════════════
// PÁGINA LOGIN — Interceptor demo
//
// Esta página se muestra cuando el interceptor redirige aquí
// porque el usuario no está "autenticado".
//
// Al "loguearse", actualiza el contexto del interceptor
// usando updateInterceptorContext() y navega a la ruta protegida.
//
// Comparación:
//   React:    Context + ProtectedRoute wrapper
//   Angular:  AuthGuard con CanActivate
//   Vue:      beforeEach en vue-router
//   Stencil:  No tiene equivalente nativo
// ═══════════════════════════════════════════════════════════════

@customElement('login-page')
export class LoginPage extends LitElement {
  pageController = new PageController(this);

  @state()
  private _username = '';

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 400px;
      margin: 2rem auto;
    }

    h1 { color: #646cff; margin-bottom: 0.5rem; }

    .subtitle {
      color: #888;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }

    .form {
      padding: 1.5rem;
      background: #2a2a3e;
      border-radius: 8px;
      border: 1px solid #333;
    }

    label {
      display: block;
      color: #aaa;
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #555;
      border-radius: 4px;
      background: #1a1a2e;
      color: #eee;
      font-size: 1rem;
      margin-bottom: 1rem;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #646cff;
    }

    button {
      width: 100%;
      padding: 0.6rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #646cff;
      color: white;
      font-size: 1rem;
    }

    button:hover { background: #535bf2; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }

    .hint {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #1a1a2e;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #666;
      font-family: monospace;
    }
  `;

  private _login() {
    if (!this._username.trim()) return;

    // Actualiza el contexto del interceptor para marcar como autenticado
    updateInterceptorContext({ isAuthenticated: true, user: this._username });

    // Navega a la ruta protegida
    this.pageController.navigate('protected');
  }

  render() {
    return html`
      <h1>Login</h1>
      <p class="subtitle">
        El interceptor te ha redirigido aquí porque la ruta está protegida.
      </p>

      <div class="form">
        <label for="username">Usuario</label>
        <input
          id="username"
          type="text"
          placeholder="Escribe cualquier nombre"
          .value=${this._username}
          @input=${(e: Event) => this._username = (e.target as HTMLInputElement).value}
          @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this._login()}
        />
        <button
          ?disabled=${!this._username.trim()}
          @click=${this._login}
        >
          Entrar
        </button>
      </div>

      <div class="hint">
        updateInterceptorContext({ isAuthenticated: true })
      </div>
    `;
  }
}
