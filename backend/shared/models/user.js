import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const User = sequelize.define('User', {
  user_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  email:    { type: DataTypes.STRING, unique: true, allowNull: false },
  nom:      { type: DataTypes.STRING, allowNull: false },
  mot_de_passe: { type: DataTypes.STRING, allowNull: false },
  photo_profil_url: DataTypes.STRING,
}, { tableName: 'users', underscored: true });

export default User;
