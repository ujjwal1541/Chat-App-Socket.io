import { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import OnlineUsers from '../components/OnlineUsers.jsx';

export default function Chat({ username, onLogout }) {
  const { messages, onlineUsers, typingUsers, error, connected, sendMessage, setTyping, clearError } = useChat(username);
  const listEndRef = useRef(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const others = typingUsers.filter((u) => u !== username);

  return (
    <div className="chat-container">
      <aside className="sidebar">
        <div className="me">
          <div className="avatar">{username[0]?.toUpperCase()}</div>
          <div>
            <div className="me-name">{username}</div>
            <div className={`status ${connected ? 'online' : 'offline'}`}>
              {connected ? '● Online' : '○ Offline'}
            </div>
          </div>
        </div>
        <OnlineUsers users={onlineUsers} me={username} />
        <button className="logout" onClick={onLogout}>Log out</button>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <h2># general</h2>
          <span className="count">{onlineUsers.length} online</span>
        </header>

        {error && (
          <div className="error-banner">
            {error} <button onClick={clearError}>×</button>
          </div>
        )}

        <MessageList messages={messages} currentUser={username} />
        <div ref={listEndRef} />

        <div className="typing">
          {others.length > 0 && (
            <em>{others.join(', ')} {others.length === 1 ? 'is' : 'are'} typing…</em>
          )}
        </div>

        <MessageInput onSend={sendMessage} onTyping={setTyping} />
      </main>
    </div>
  );
}
