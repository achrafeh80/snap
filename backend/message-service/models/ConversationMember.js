import { DataTypes } from 'sequelize';
import { sequelize } from '../../../shared/db.js';

export default sequelize.define(
  'ConversationMember',
  { conv_id: { type: DataTypes.UUID, primaryKey: true }, user_id: { type: DataTypes.UUID, primaryKey: true } },
  { tableName: 'conversation_members', underscored: true }
);
