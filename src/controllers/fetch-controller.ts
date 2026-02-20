import { ReactiveController, ReactiveControllerHost } from 'lit';

// Controller genérico para fetch de datos.
// Demuestra cómo encapsular lógica async reutilizable.
//
// Stencil equivalente: tendrías un servicio externo, pero
// no podría pedir re-renders automáticamente ni participar
// en el ciclo de vida del componente.
export class FetchController<T> implements ReactiveController {
  host: ReactiveControllerHost;

  data: T | null = null;
  loading = false;
  error: string | null = null;

  private _url: string;
  private _abortController?: AbortController;

  constructor(host: ReactiveControllerHost, url: string) {
    this.host = host;
    this._url = url;
    host.addController(this);
  }

  // hostConnected se llama al montar — lanzamos el fetch automáticamente
  hostConnected() {
    this.fetch();
  }

  hostDisconnected() {
    // Cancelar fetch pendiente al desmontar
    this._abortController?.abort();
  }

  async fetch(url?: string) {
    if (url) this._url = url;

    this._abortController?.abort();
    this._abortController = new AbortController();

    this.loading = true;
    this.error = null;
    this.data = null;
    this.host.requestUpdate();

    try {
      const response = await fetch(this._url, {
        signal: this._abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.data = await response.json() as T;
      this.loading = false;
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        this.error = (e as Error).message;
        this.loading = false;
      }
    }

    this.host.requestUpdate();
  }
}
