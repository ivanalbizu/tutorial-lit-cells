import { ReactiveController, ReactiveControllerHost } from 'lit';
import { subscribe, unsubscribe } from '@open-cells/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'info' | 'error';
}

const CHANNEL = 'toast-messages';
let _nextId = 0;
let _messages: ToastMessage[] = [];
const _hosts = new Set<ReactiveControllerHost>();

export class ToastController implements ReactiveController {
  host: ReactiveControllerHost;

  get messages(): ToastMessage[] {
    return _messages;
  }

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    _hosts.add(this.host);
    subscribe(CHANNEL, this.host, (msgs: ToastMessage[]) => {
      _messages = msgs;
      _hosts.forEach(h => h.requestUpdate());
    });
  }

  hostDisconnected() {
    _hosts.delete(this.host);
    unsubscribe(CHANNEL, this.host);
  }

  show(text: string, type: ToastMessage['type'] = 'success') {
    const id = _nextId++;
    const msg: ToastMessage = { id, text, type };
    _messages = [..._messages, msg];
    _hosts.forEach(h => h.requestUpdate());
    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number) {
    _messages = _messages.filter(m => m.id !== id);
    _hosts.forEach(h => h.requestUpdate());
  }
}
