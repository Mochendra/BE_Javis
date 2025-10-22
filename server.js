import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import sequelize from './config/db.js';

import authRoutes from './routes/auth.js';
import { authMiddleware } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS config
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Selamat datang di dashboard, ${req.user.name}` });
});
app.get('/', (req, res) => res.send('Backend Express berjalan'));

// Catch-all route (404)
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

// DB connect
sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Unable to connect to DB:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
