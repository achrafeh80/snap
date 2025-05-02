import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export default function initSocket(httpServer) {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('join', ({ token }) => {
      try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = userId;
        socket.join(`user_${userId}`);
      } catch {
        socket.disconnect();
      }
    });
    socket.on('joinConversation', ({ convId }) => socket.join(`conv_${convId}`));
  });

  return io;
}
