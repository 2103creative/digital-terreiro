import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(terreiroId: string) {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000');
    socket.emit('joinTerreiro', terreiroId);
  }
  return socket;
}

export function getSocket() {
  if (!socket) throw new Error('Socket not connected');
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
