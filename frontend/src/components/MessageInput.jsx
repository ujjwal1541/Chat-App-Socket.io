import { useState } from 'react';

export default function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    onTyping(false);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  return (
    <form className="input-bar" onSubmit={submit}>
      <input
        type="text"
        placeholder="Type a message…"
        value={text}
        onChange={handleChange}
        maxLength={2000}
        autoFocus
      />
      <button type="submit" disabled={!text.trim()}>Send</button>
    </form>
  );
}
