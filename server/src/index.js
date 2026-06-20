import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes     from './routes/auth.js';
import locationRoutes from './routes/locations.js';
import checkinRoutes  from './routes/checkins.js';
import userRoutes     from './routes/user.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/checkins',  checkinRoutes);
app.use('/api/user',      userRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
