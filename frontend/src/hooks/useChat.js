import { useEffect, useRef, useState } from 'react';
import { fetchMessages } from '../services/api';
import { getSocket } from '../services/socket';

export function useChat(username) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchMessages()
      .then((msgs) => !cancelled && setMessages(msgs))
      .catch((e) => {
        if (cancelled) return;
        if (e?.code === 'NETWORK_ERROR') {
          console.warn('Skipping chat history load because the API is unreachable from the browser.', e);
          return;
        }
        setError(e.message || 'Failed to load messages');
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setConnected(true);
      socket.emit('user:join', { username });
    };
    const onDisconnect = () => setConnected(false);
    const onNewMessage = (msg) => setMessages((prev) => [...prev, msg]);
    const onOnline = (users) => setOnlineUsers(users);
    const onTyping = ({ username: u, isTyping }) => {
      setTypingUsers((prev) => {
        const set = new Set(prev);
        if (isTyping) set.add(u); else set.delete(u);
        return Array.from(set);
      });
    };
    const onError = (err) => setError(err?.message || 'Socket connection error');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message:new', onNewMessage);
    socket.on('users:online', onOnline);
    socket.on('typing:update', onTyping);
    socket.on('connect_error', onError);

    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message:new', onNewMessage);
      socket.off('users:online', onOnline);
      socket.off('typing:update', onTyping);
      socket.off('connect_error', onError);
    };
  }, [username]);

  const sendMessage = (text) => {
    const socket = getSocket();
    socket.emit('message:send', { username, text }, (ack) => {
      if (!ack?.ok) setError(ack?.error || 'Failed to send');
    });
  };

  const setTyping = (isTyping) => {
    const socket = getSocket();
    socket.emit('typing', { username, isTyping });
    if (isTyping) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit('typing', { username, isTyping: false });
      }, 2000);
    }
  };

  return { messages, onlineUsers, typingUsers, error, connected, sendMessage, setTyping, clearError: () => setError('') };
}
