import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { ToastController, ToastMessage } from '../controllers/toast-controller.js';

@customElement('toast-container')
export class ToastContainer extends LitElement {
  toast = new ToastController(this);

  static styles = css`
    :host {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 1000;
      display: flex;
      flex-direction: column-reverse;
      gap: 0.5rem;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      color: white;
      font-size: 0.9rem;
      pointer-events: auto;
      animation: slide-in 0.3s ease-out;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      max-width: 360px;
    }

    .toast.success {
      background: #2e7d32;
    }

    .toast.info {
      background: #1565c0;
    }

    .toast.error {
      background: #c62828;
    }

    .dismiss {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0;
      margin-left: auto;
      line-height: 1;
    }

    .dismiss:hover {
      color: white;
    }

    .dismiss:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;

  render() {
    return html`
      ${repeat(this.toast.messages, (m: ToastMessage) => m.id, (m: ToastMessage) => html`
        <div
          class=${classMap({ toast: true, [m.type]: true })}
          role="alert"
          aria-live="assertive"
        >
          <span>${m.text}</span>
          <button
            class="dismiss"
            @click=${() => this.toast.dismiss(m.id)}
            aria-label="Cerrar notificación"
          >&times;</button>
        </div>
      `)}
    `;
  }
}
