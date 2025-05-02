import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { sequelize } from '../../shared/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
dotenv.config();

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  })
);
app.use(express.json());

// limite brute-force
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

await sequelize.authenticate();
app.listen(process.env.PORT, () =>
  console.log(`User-service écoute sur ${process.env.PORT}`)
);
