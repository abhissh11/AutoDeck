import express from 'express';
import routes from './routes/index.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const FRONTEND_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173';

//  CORS middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Serve generated PPT files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AI Slide Builder Backend' });
});

app.use('/api', routes);

// Global error handler (catches CORS + others)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.message.includes('CORS')) {
    return res.status(403).json({ message: 'CORS error: Not allowed by server' });
  }
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server with DB connection
async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
