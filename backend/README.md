# Backend deployment notes

- Render uses the `npm start` script defined in package.json.
- Set `MONGO_URI` to your MongoDB connection string.
- Set `CLIENT_ORIGIN` to your Vercel frontend URL so CORS and Socket.IO accept it.
