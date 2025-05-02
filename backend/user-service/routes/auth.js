import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../shared/models/index.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, nom, motDePasse } = req.body;
  if (!email || !nom || !motDePasse) return res.status(400).send('Manque champs');
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).send('Email pris');
  const hash = await bcrypt.hash(motDePasse, 10);
  await User.create({ email, nom, mot_de_passe: hash });
  res.status(201).send('OK');
});

router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).send('Bad creds');
  const ok = await bcrypt.compare(motDePasse, user.mot_de_passe);
  if (!ok) return res.status(401).send('Bad creds');
  const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  res.json({ token, userId: user.user_id, nom: user.nom });
});

export default router;
