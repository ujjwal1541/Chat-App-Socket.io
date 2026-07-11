# Backend deployment notes

- Render uses the `npm start` script defined in package.json.
- Set `MONGO_URI` to your MongoDB connection string.
- Set `CLIENT_ORIGINS` to a comma-separated list such as `https://chat-app-socket-io-opal.vercel.app,http://localhost:5173` so CORS and Socket.IO accept both your deployed frontend and local dev app.
