import { ReactiveController, ReactiveControllerHost } from 'lit';

// ═══════════════════════════════════════════════════════════════
// REACTIVE CONTROLLERS
//
// Son la forma de Lit de extraer lógica reutilizable que necesita
// participar en el ciclo de vida del componente.
//
// Stencil no tiene equivalente directo. Lo más cercano sería:
//   - Mixins (herencia múltiple limitada)
//   - Servicios/clases externas (pero sin acceso al lifecycle)
//   - Hooks de React/Stencil (concepto similar, distinta API)
//
// Un controller:
//   1. Recibe el host (componente) en el constructor
//   2. Se registra con host.addController(this)
//   3. Participa en el ciclo de vida (hostConnected, hostDisconnected, etc.)
//   4. Puede pedir re-render al host con host.requestUpdate()
//   5. Se puede reutilizar en CUALQUIER componente Lit
// ═══════════════════════════════════════════════════════════════

export class ClockController implements ReactiveController {
  host: ReactiveControllerHost;

  private _intervalId?: number;
  private _interval: number;

  value = new Date();
  ticks = 0;

  constructor(host: ReactiveControllerHost, interval = 1000) {
    this._interval = interval;
    this.host = host;
    // Registrar el controller en el host
    // Esto permite que el host llame a hostConnected/hostDisconnected
    host.addController(this);
  }

  // Se llama cuando el componente host se conecta al DOM
  // Equivalente a connectedCallback del componente
  hostConnected() {
    this._intervalId = window.setInterval(() => {
      this.value = new Date();
      this.ticks++;
      // Pedir al host que re-renderice
      this.host.requestUpdate();
    }, this._interval);
  }

  // Se llama cuando el componente host se desconecta del DOM
  // Equivalente a disconnectedCallback — limpiamos recursos
  hostDisconnected() {
    if (this._intervalId !== undefined) {
      clearInterval(this._intervalId);
    }
  }
}
