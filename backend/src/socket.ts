import { Server, Socket } from 'socket.io';
import http from 'http';

export let io: Server;

export function setupSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket: Socket) => {
    // O cliente deve se juntar a uma sala específica do terreiro
    socket.on('joinTerreiro', (terreiroId: string) => {
      socket.join(`terreiro_${terreiroId}`);
    });
  });
}

// Utilitário para emitir eventos para uma sala específica
type ThemePayload = { theme: any };
export function emitThemeUpdated(terreiroId: string, theme: ThemePayload) {
  if (io) {
    io.to(`terreiro_${terreiroId}`).emit('themeUpdated', theme);
  }
}

export function emitFrenteCreated(terreiroId: string, frente: any) {
  if (io) {
    io.to(`terreiro_${terreiroId}`).emit('frenteCreated', frente);
  }
}
export function emitFrenteUpdated(terreiroId: string, frente: any) {
  if (io) {
    io.to(`terreiro_${terreiroId}`).emit('frenteUpdated', frente);
  }
}
export function emitFrenteDeleted(terreiroId: string, frenteId: string) {
  if (io) {
    io.to(`terreiro_${terreiroId}`).emit('frenteDeleted', { id: frenteId });
  }
}

export function emitUserCreated(terreiroId: string, user: any) {
  if (io) {
    io.to(`terreiro_${terreiroId}`).emit('userCreated', user);
  }
}
export function emitUserUpdated(terreiroId: string, user: any) {
  if (io) {
    io.to(`terreiro_${terreiroId}`).emit('userUpdated', user);
  }
}
export function emitUserDeleted(terreiroId: string, userId: string) {
  if (io) {
    io.to(`terreiro_${terreiroId}`).emit('userDeleted', { id: userId });
  }
}
