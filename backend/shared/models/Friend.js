import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Friend = sequelize.define('Friend', {
  user_id: { type: DataTypes.UUID, primaryKey: true },
  ami_id:  { type: DataTypes.UUID, primaryKey: true },
  statut:  { type: DataTypes.STRING, defaultValue: 'confirmed' }
});
Friend.belongsTo(User, { as: 'ami', foreignKey: 'ami_id' });
export default Friend;