require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { parseAllowedOrigins } = require('./config/origins');
const messageRoutes = require('./routes/messages');
const registerSocketHandlers = require('./sockets');

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGINS = parseAllowedOrigins(process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS || 'http://localhost:5173');

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || CLIENT_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/messages', messageRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);
registerSocketHandlers(io);

(async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
