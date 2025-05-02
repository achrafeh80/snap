import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ message: 'Token manquant' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(403).json({ message: 'Token invalide ou expiré' });
  }
}
