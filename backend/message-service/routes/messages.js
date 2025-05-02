import { Router } from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import authenticate from '../../../../shared/authMiddleware.js';
import Conversation from '../models/conversation.js';
import ConversationMember from './models/conversationMember.js';
import Message from './models/message.js';

// assure uploads/
fs.ensureDirSync('uploads');

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/', authenticate, upload.single('media'), async (req, res) => {
  const { texte, conversationId, destinataires } = req.body;
  const destArray =
  typeof destinataires === 'string'
    ? JSON.parse(destinataires)
    : destinataires;
  let convId = conversationId;
  let conv;

  // JSON fallback (pas de fichier) 
  if (!req.file && req.is('application/json')) upload.none();

  if (!convId) {
    if (!destArray || destArray.length === 0)
      return res.status(400).send('destinataires?');
  
    conv = await Conversation.create();
    convId = conv.conv_id;
  
    await ConversationMember.bulkCreate(
      [
        { conv_id: convId, user_id: req.user.userId },
        ...destArray.map((d) => ({ conv_id: convId, user_id: d })),
      ],
      { ignoreDuplicates: true }
    );
  }
  if (!conv) {
    await Conversation.findByPk(convId);
  }

  const msg = await Message.create({
    conv_id: convId,
    expediteur_id: req.user.userId,
    texte: texte || null,
    media_url: req.file?.path ?? null,
  });

  // notify via socket.io
  req.io.to(`conv_${convId}`).emit('nouveau_message', {
    conversationId: convId,
    message: msg,
  });

  res.status(201).json({ convId, msgId: msg.msg_id });
});

router.get('/:convId/messages', authenticate, async (req, res) => {
  const msgs = await Message.findAll({
    where: { conv_id: req.params.convId },
    order: [['date_envoye', 'ASC']],
  });
  res.json(msgs);
});

export default router;
