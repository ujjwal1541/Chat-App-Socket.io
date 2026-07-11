const Message = require('../models/Message');

// Map socket.id -> username
const onlineUsers = new Map();

function broadcastOnlineUsers(io) {
  const users = Array.from(new Set(onlineUsers.values()));
  io.emit('users:online', users);
}

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('user:join', ({ username }) => {
      try {
        if (!username) return;
        onlineUsers.set(socket.id, username);
        broadcastOnlineUsers(io);
      } catch (err) {
        console.error('user:join error', err);
      }
    });

    socket.on('message:send', async ({ username, text }, ack) => {
      try {
        if (!username || !text?.trim()) {
          if (ack) ack({ ok: false, error: 'username and text required' });
          return;
        }
        const message = await Message.create({ username, text: text.trim() });
        io.emit('message:new', message);
        if (ack) ack({ ok: true, message });
      } catch (err) {
        console.error('message:send error', err);
        if (ack) ack({ ok: false, error: 'Failed to send message' });
      }
    });

    socket.on('typing', ({ username, isTyping }) => {
      socket.broadcast.emit('typing:update', { username, isTyping });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers(io);
      console.log('❌ Client disconnected:', socket.id);
    });
  });
}

module.exports = registerSocketHandlers;
