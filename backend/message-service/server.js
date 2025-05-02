import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { sequelize } from '../../../shared/db.js';
import conversRoutes from './routes/conversations.js';
import msgRoutes from './routes/messages.js';
import fs from 'fs-extra';
import initSocket from './socket.js';
dotenv.config();

// uploads dir 
fs.ensureDirSync('uploads');

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/conversations', conversRoutes);
app.use('/api/messages', msgRoutes);

const server = http.createServer(app);
const io = initSocket(server);
app.use((req, _res, next) => {
  req.io = io; // partager instance
  next();
});

await sequelize.authenticate();
server.listen(process.env.PORT, () =>
  console.log('message-service on ' + process.env.PORT)
);
