import { Router } from 'express';
import authenticate from '../../../shared/authMiddleware.js';
import { User, Friend } from '../../../shared/models/index.js';
const router = Router();

router.get('/users/me', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: ['user_id', 'email', 'nom', 'photo_profil_url'],
  });
  res.json(user);
});

router.put('/users/me', authenticate, async (req, res) => {
  await User.update(req.body, { where: { user_id: req.user.userId } });
  res.sendStatus(204);
});

router.get('/users', authenticate, async (req, res) => {
  if (!req.query.email) return res.status(400).send('email?');
  const u = await User.findOne({
    where: { email: req.query.email },
    attributes: ['user_id', 'nom'],
  });
  res.json(u);
});

router.post('/users/:id/add-friend', authenticate, async (req, res) => {
  const { id } = req.params;
  if (id === req.user.userId) return res.status(400).send('self');
  await Friend.bulkCreate(
    [
      { user_id: req.user.userId, ami_id: id },
      { user_id: id, ami_id: req.user.userId },
    ],
    { ignoreDuplicates: true }
  );
  res.status(201).send('friend added');
});

router.get('/users/me/friends', authenticate, async (req, res) => {
  const amis = await Friend.findAll({
    where: { user_id: req.user.userId },
    include: { model: User, as: 'ami', attributes: ['user_id', 'nom'] },
  });
  res.json(amis.map((a) => a.ami));
});

export default router;
