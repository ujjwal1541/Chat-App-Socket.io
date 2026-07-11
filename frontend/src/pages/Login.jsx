import { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onLogin(trimmed);
  };
  return (
    <div className="login-container">
      <form className="login-card" onSubmit={submit}>
        <h1>💬 Chatly</h1>
        <p>Enter a username to join the chat</p>
        <input
          autoFocus
          type="text"
          placeholder="Your username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
        />
        <button type="submit" disabled={!name.trim()}>Join Chat</button>
      </form>
    </div>
  );
}
