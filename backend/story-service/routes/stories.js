import { Router } from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import { Op } from 'sequelize';
import authenticate from '../../../../shared/authMiddleware.js';
import Story from './models/story.js';

fs.ensureDirSync('uploads');
const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/', authenticate, upload.single('media'), async (req, res) => {
  const { lat, lon } = req.body;
  if (!req.file || isNaN(lat) || isNaN(lon))
    return res.status(400).send('media + coords');
  const story = await Story.create({
    user_id: req.user.userId,
    media_url: req.file.path,
    localisation_lat: parseFloat(lat),
    localisation_lon: parseFloat(lon),
    expiration: new Date(Date.now() + 24 * 3600 * 1000),
  });
  res.status(201).json({ story_id: story.story_id });
});

router.get('/', authenticate, async (req, res) => {
  const { lat, lon, rayon = 5 } = req.query;
  const where = {
    date_pub: { [Op.gte]: new Date(Date.now() - 24 * 3600 * 1000) },
  };
  if (lat && lon) {
    const dLat = rayon / 111.12;
    const dLon = rayon / (111.12 * Math.cos((lat * Math.PI) / 180));
    Object.assign(where, {
      localisation_lat: { [Op.between]: [lat - dLat, +lat + dLat] },
      localisation_lon: { [Op.between]: [lon - dLon, +lon + dLon] },
    });
  }
  res.json(await Story.findAll({ where }));
});

router.delete('/:id', authenticate, async (req, res) => {
  const story = await Story.findByPk(req.params.id);
  if (!story || story.user_id !== req.user.userId) return res.sendStatus(404);
  await Story.destroy({ where: { story_id: req.params.id } });
  fs.remove(story.media_url);
  res.sendStatus(204);
});

export default router;
