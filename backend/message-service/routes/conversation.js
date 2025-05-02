import { Router } from 'express';
import authenticate from '../../../../shared/authMiddleware.js';
import Conversation from '../models/conversation.js';
import ConversationMember from './models/conversationMember.js';
import Message from './models/message.js';

const router = Router();
router.get('/', authenticate, async (req, res) => {
  const convIds = (
    await ConversationMember.findAll({
      where: { user_id: req.user.userId },
      attributes: ['conv_id'],
    })
  ).map((c) => c.conv_id);

  const convs = await Promise.all(
    convIds.map(async (cid) => {
      const convo = await Conversation.findByPk(cid);
      const last = await Message.findOne({
        where: { conv_id: cid },
        order: [['date_envoye', 'DESC']],
      });
      const members = await ConversationMember.findAll({ where: { conv_id: cid } });
      return {
        conv_id: cid,
        titre: convo.titre,
        membres: members.map((m) => m.user_id),
        dernierMessage: last,
      };
    })
  );
  res.json(convs);
});

export default router;
