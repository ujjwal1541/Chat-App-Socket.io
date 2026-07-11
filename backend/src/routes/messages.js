const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// GET /api/messages — fetch chat history (most recent 200)
router.get('/', async (_req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(500).lean();
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// POST /api/messages — persist a message (also emitted via socket)
router.post('/', async (req, res, next) => {
  try {
    const { username, text } = req.body || {};
    if (!username || !text) {
      return res.status(400).json({ error: 'username and text are required' });
    }
    const message = await Message.create({ username, text });
    // Broadcast via socket if available
    const io = req.app.get('io');
    if (io) io.emit('message:new', message);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
