import { DataTypes } from 'sequelize';
import { sequelize } from '../../../shared/db.js';

export default sequelize.define(
  'Story',
  {
    story_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: DataTypes.UUID,
    media_url: DataTypes.STRING,
    localisation_lat: DataTypes.FLOAT,
    localisation_lon: DataTypes.FLOAT,
    date_pub: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    expiration: DataTypes.DATE,
  },
  { tableName: 'stories', underscored: true }
);
