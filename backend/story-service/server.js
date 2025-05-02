import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import { sequelize } from '../../../shared/db.js';
import storiesRoutes from './routes/stories.js';
dotenv.config();

fs.ensureDirSync('uploads');

const app = express();
app.use(
  cors({ origin: process.env.ALLOWED_ORIGINS.split(','), credentials: true })
);
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/stories', storiesRoutes);

await sequelize.authenticate();
app.listen(process.env.PORT, () =>
  console.log('story-service on ' + process.env.PORT)
);
