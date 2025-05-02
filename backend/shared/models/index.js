import { sequelize } from '../db.js';
import User from './User.js';
import Friend from './friend.js';

User.hasMany(Friend, { foreignKey: 'user_id' });
sequelize.sync();   
export { User, Friend };