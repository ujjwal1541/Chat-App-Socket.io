function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageList({ messages, currentUser }) {
  if (!messages.length) {
    return <div className="empty">No messages yet. Say hi 👋</div>;
  }
  return (
    <div className="messages">
      {messages.map((m) => {
        const mine = m.username === currentUser;
        return (
          <div key={m._id || m.createdAt + m.username} className={`msg ${mine ? 'mine' : 'theirs'}`}>
            {!mine && <div className="msg-user">{m.username}</div>}
            <div className="bubble">
              <span>{m.text}</span>
              <time>{formatTime(m.createdAt)}</time>
            </div>
          </div>
        );
      })}
    </div>
  );
}
