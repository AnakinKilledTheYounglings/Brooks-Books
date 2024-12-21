// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import authRouter from './routes/auth.js';
import bookRouter from './routes/books.js';
import translationRouter from './routes/translation.js';
import usersRouter from './routes/users.js';
import vocabularyRoutes from './routes/vocabulary.js';
import quizRoutes from './routes/quiz.js';
import gifsRouter from './routes/gifs.js';
import discussionsRouter from './routes/discussions.js';
import { WebSocketServer } from 'ws';
import http from 'http';

dotenv.config();

// Initialize express and create HTTP server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Route Middlewares - organize all routes here
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/gifs', gifsRouter);
app.use('/api/discussions', discussionsRouter);
app.use('/api/users', usersRouter);  // Changed from /api to /api/users
app.use('/api/translate', translationRouter);  // Changed from /api to /api/translate

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// WebSocket Configuration
const messages = [];
const MESSAGES_LIMIT = 200;

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  // Send existing messages to new connections
  ws.send(JSON.stringify({ type: 'history', messages }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      messages.push(message);
      if (messages.length > MESSAGES_LIMIT) {
        messages.shift();
      }

      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'message', message }));
        }
      });
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware - add this before starting server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Connect to database before starting server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 3001;