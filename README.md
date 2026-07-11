# Real-Time Chat Application

A full-stack real-time chat app built with **React (Vite)** on the frontend and **Node.js + Express + Socket.io + MongoDB** on the backend.

## Features

- ⚡ Real-time messaging via Socket.io
- 💾 Persistent message history (MongoDB)
- 👤 Username-based dummy login
- ⌨️ Typing indicator
- 🟢 Online/offline user status
- 🕒 Message timestamps
- 📱 Clean, responsive chat UI

---

## Project Structure

```
chatapp/
├── backend/          # Node.js + Express + Socket.io + MongoDB
│   └── src/
│       ├── config/       # DB connection
│       ├── models/       # Mongoose schemas
│       ├── routes/       # REST API routes
│       ├── sockets/      # Socket.io handlers
│       └── index.js      # Entry point
└── frontend/         # React (Vite)
    └── src/
        ├── components/   # Chat UI components
        ├── hooks/        # Custom hooks
        ├── services/     # API + socket clients
        └── pages/        # Login & Chat pages
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` (or use MongoDB Atlas — set `MONGO_URI` accordingly)
- A free MongoDB Atlas account if you want a cloud database for deployment

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env    # then edit values if needed
npm run dev             # runs on http://localhost:5000
```

### Backend Environment Variables (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chatapp
CLIENT_ORIGIN=http://localhost:5173
```

### REST APIs

| Method | Endpoint             | Description             |
|--------|----------------------|-------------------------|
| GET    | `/api/messages`      | Fetch chat history      |
| POST   | `/api/messages`      | Send a message          |
| GET    | `/api/health`        | Health check            |

### Socket.io Events

| Event            | Direction        | Payload                        |
|------------------|------------------|--------------------------------|
| `user:join`      | client → server  | `{ username }`                 |
| `message:send`   | client → server  | `{ username, text }`           |
| `message:new`    | server → client  | `Message` object               |
| `typing`         | client → server  | `{ username, isTyping }`       |
| `typing:update`  | server → client  | `{ username, isTyping }`       |
| `users:online`   | server → client  | `[username, ...]`              |

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env    # optional
npm run dev             # runs on http://localhost:5173
```

### Frontend Environment Variables (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000
```

---

## Running the App

1. Start MongoDB
2. In one terminal: `cd backend && npm run dev`
3. In another terminal: `cd frontend && npm run dev`
4. Open http://localhost:5173, enter a username, and chat!

Open multiple browser tabs / windows with different usernames to see real-time messaging in action.

---

## Design Decisions

- **Vite + React** for a fast, minimal frontend with modern DX.
- **Socket.io** used for both delivery and presence/typing indicators — single connection, robust reconnection.
- **REST + Sockets combo**: REST is used to bootstrap chat history on load; Socket.io handles all live updates. This decouples "history retrieval" from "live streaming".
- **MongoDB via Mongoose** for schemaful message persistence, timestamps auto-managed.
- **Dummy auth** — no passwords stored. Username is kept in `localStorage` and passed with each socket handshake. Easy to swap for real auth later.
- **Clean folder structure** — separation of routes, models, sockets, config on the backend; components, hooks, services on the frontend.
- **Graceful error handling** — REST errors return JSON error objects; socket handlers wrapped in try/catch; frontend surfaces errors via toast-like inline banners.

## Assumptions

- Single public chat room (broadcast to all connected clients). Rooms/DMs can be added on top of the existing schema by adding a `room` field.
- No message editing/deletion required.
- Dummy auth (no password) is acceptable per the spec.
- MongoDB is available locally or via `MONGO_URI`.
