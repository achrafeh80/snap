import { DataTypes } from 'sequelize';
import { sequelize } from '../../../shared/db.js';

export default sequelize.define(
  'Message',
  {
    msg_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    conv_id: DataTypes.UUID,
    expediteur_id: DataTypes.UUID,
    texte: DataTypes.TEXT,
    media_url: DataTypes.STRING,
    date_envoye: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    lu: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'messages', underscored: true }
);
