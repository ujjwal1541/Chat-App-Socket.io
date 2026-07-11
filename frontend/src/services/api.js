const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = rawApiUrl.replace(/\/$/, '').replace(/\/api\/?$/, '');

async function requestJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.text();
  let parsed;
  try {
    parsed = data ? JSON.parse(data) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    throw new Error(parsed?.error || parsed?.message || `Request failed with ${res.status}`);
  }

  return parsed;
}

export async function fetchMessages() {
  return requestJson(`${API_URL}/api/messages`);
}

export async function sendMessageREST({ username, text }) {
  return requestJson(`${API_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, text }),
  });
}

export { API_URL };

