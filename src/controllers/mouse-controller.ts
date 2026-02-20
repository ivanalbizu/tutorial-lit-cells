import { ReactiveController, ReactiveControllerHost } from 'lit';

// Controller que trackea la posición del ratón.
// Demuestra cómo un controller gestiona event listeners globales
// y los limpia automáticamente al desconectar.
export class MouseController implements ReactiveController {
  host: ReactiveControllerHost;

  x = 0;
  y = 0;

  private _onMouseMove = (e: MouseEvent) => {
    this.x = e.clientX;
    this.y = e.clientY;
    this.host.requestUpdate();
  };

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    window.addEventListener('mousemove', this._onMouseMove);
  }

  hostDisconnected() {
    window.removeEventListener('mousemove', this._onMouseMove);
  }
}
