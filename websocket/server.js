/**
 * WebSocket Server
 * Real-time updates: contact notifications, live view counts, etc.
 *
 * Usage:
 *   import { WebSocketServer } from 'ws';
 *   const wss = new WebSocketServer({ server });
 *   wss.on('connection', handleConnection);
 */

import { WebSocketServer } from 'ws';
import { verifyToken } from '../server/middleware/auth.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production-please';

/**
 * Initialize WebSocket server
 */
export function initWebSocket(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (socket, req) => handleConnection(wss, socket, req));

  return wss;
}

/**
 * Handle a new connection
 */
function handleConnection(wss, socket, req) {
  const url = new URL(req.url, 'http://localhost');
  const token = url.searchParams.get('token');
  const user = token ? verifyToken(token) : null;

  socket.user = user;
  socket.isAlive = true;
  socket.channels = new Set(['public']);  // public channel by default

  if (user) {
    if (user.role === 'admin') socket.channels.add('admin');
    socket.channels.add(`user:${user.id}`);
  }

  console.log(`[WS] Connected: ${user?.email || 'anonymous'} (channels: ${[...socket.channels].join(', ')})`);

  socket.on('pong', () => { socket.isAlive = true; });

  socket.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);
      handleMessage(wss, socket, msg);
    } catch (e) {
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
    }
  });

  socket.on('close', () => {
    console.log(`[WS] Disconnected: ${user?.email || 'anonymous'}`);
  });

  // Send welcome
  socket.send(JSON.stringify({
    type: 'connected',
    channels: [...socket.channels],
    timestamp: Date.now()
  }));
}

/**
 * Handle a client message
 */
function handleMessage(wss, socket, msg) {
  switch (msg.type) {
    case 'ping':
      socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;

    case 'subscribe':
      if (msg.channel && socket.user) {
        socket.channels.add(msg.channel);
        socket.send(JSON.stringify({ type: 'subscribed', channel: msg.channel }));
      }
      break;

    case 'unsubscribe':
      socket.channels.delete(msg.channel);
      socket.send(JSON.stringify({ type: 'unsubscribed', channel: msg.channel }));
      break;

    case 'broadcast':
      // Only admins can broadcast
      if (socket.user?.role === 'admin') {
        broadcast(wss, msg.channel || 'public', msg.payload, socket);
      } else {
        socket.send(JSON.stringify({ type: 'error', message: 'Permission denied' }));
      }
      break;

    default:
      socket.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
  }
}

/**
 * Broadcast a message to all sockets in a channel
 */
export function broadcast(wss, channel, payload, excludeSocket = null) {
  const message = JSON.stringify({
    type: 'broadcast',
    channel,
    payload,
    timestamp: Date.now()
  });

  for (const client of wss.clients) {
    if (client.readyState !== 1) continue;  // OPEN
    if (!client.channels.has(channel)) continue;
    if (client === excludeSocket) continue;
    client.send(message);
  }
}

/**
 * Send a message to a specific user
 */
export function notify(wss, userId, payload) {
  const message = JSON.stringify({
    type: 'notification',
    payload,
    timestamp: Date.now()
  });

  for (const client of wss.clients) {
    if (client.readyState !== 1) continue;
    if (client.channels.has(`user:${userId}`)) {
      client.send(message);
    }
  }
}

// Heartbeat — kill dead connections
function heartbeat(wss) {
  for (const client of wss.clients) {
    if (!client.isAlive) { client.terminate(); continue; }
    client.isAlive = false;
    client.ping();
  }
}

export function startHeartbeat(wss, intervalMs = 30000) {
  return setInterval(() => heartbeat(wss), intervalMs);
}
