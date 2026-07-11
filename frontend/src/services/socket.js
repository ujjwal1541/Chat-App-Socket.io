import { io } from 'socket.io-client';
import { API_URL } from './api';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(API_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
