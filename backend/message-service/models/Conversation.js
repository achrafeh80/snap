import { DataTypes } from 'sequelize';
import { sequelize } from '../../../shared/db.js';

export default sequelize.define(
  'Conversation',
  { conv_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 }, titre: DataTypes.STRING },
  { tableName: 'conversations', underscored: true }
);
