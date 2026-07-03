/**
 * WebSocket Client Helper
 * Auto-reconnecting, event-based client for the browser
 *
 * Usage:
 *   import { createClient } from './client.js';
 *   const ws = createClient({ token: 'xxx' });
 *   ws.on('notification', ({ payload }) => console.log(payload));
 */

export function createClient({ url, token, reconnectInterval = 3000, maxReconnects = 10 } = {}) {
  const wsUrl = url || `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;
  const fullUrl = token ? `${wsUrl}?token=${token}` : wsUrl;

  const listeners = {};
  let socket = null;
  let reconnectAttempts = 0;
  let intentionallyClosed = false;

  function connect() {
    socket = new WebSocket(fullUrl);

    socket.addEventListener('open', () => {
      reconnectAttempts = 0;
      emit('open');
    });

    socket.addEventListener('message', (e) => {
      try {
        const msg = JSON.parse(e.data);
        emit(msg.type || 'message', msg);
      } catch (err) {
        emit('error', err);
      }
    });

    socket.addEventListener('close', () => {
      emit('close');
      if (!intentionallyClosed && reconnectAttempts < maxReconnects) {
        reconnectAttempts++;
        setTimeout(connect, reconnectInterval);
      }
    });

    socket.addEventListener('error', (e) => emit('error', e));
  }

  function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }

  function off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  }

  function emit(event, data) {
    if (!listeners[event]) return;
    for (const cb of listeners[event]) cb(data);
  }

  function send(data) {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(typeof data === 'string' ? data : JSON.stringify(data));
    }
  }

  function close() {
    intentionallyClosed = true;
    socket?.close();
  }

  connect();

  return { on, off, send, close };
}
