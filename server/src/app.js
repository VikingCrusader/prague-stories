import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes     from './routes/auth.js';
import locationRoutes from './routes/locations.js';
import checkinRoutes  from './routes/checkins.js';
import userRoutes     from './routes/user.js';

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://prague-stories.vercel.app',
  ...(process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : []),
];
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/checkins',  checkinRoutes);
app.use('/api/user',      userRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

export default app;
