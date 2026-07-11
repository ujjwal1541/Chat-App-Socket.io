import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Chat from './pages/Chat.jsx';

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');

  useEffect(() => {
    if (username) localStorage.setItem('username', username);
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
  };

  if (!username) return <Login onLogin={setUsername} />;
  return <Chat username={username} onLogout={handleLogout} />;
}
