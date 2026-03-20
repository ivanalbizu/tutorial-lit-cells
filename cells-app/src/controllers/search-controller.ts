import { ReactiveController, ReactiveControllerHost } from 'lit';

export class SearchController implements ReactiveController {
  host: ReactiveControllerHost;

  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _delay: number;

  query = '';

  constructor(host: ReactiveControllerHost, delay = 300) {
    this.host = host;
    this._delay = delay;
    host.addController(this);
  }

  hostDisconnected() {
    this.cancel();
  }

  update(value: string) {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.query = value;
      this.host.requestUpdate();
    }, this._delay);
  }

  cancel() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  clear() {
    this.cancel();
    this.query = '';
    this.host.requestUpdate();
  }
}
