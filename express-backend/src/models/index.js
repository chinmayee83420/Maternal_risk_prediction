const { sequelize } = require('../config/db');
const User = require('./User');
const PredictionHistory = require('./PredictionHistory');

// Associations
User.hasMany(PredictionHistory, {
  foreignKey: 'userId',
  as: 'predictions',
  onDelete: 'CASCADE',
});

PredictionHistory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('[INFO] PostgreSQL connected successfully.');
    await sequelize.sync({ alter: false });
    console.log('[INFO] Database models & tables verified/synchronized.');
    return true;
  } catch (error) {
    console.warn(`[WARNING] Database connection issue (${error.message}).`);
    return false;
  }
}

module.exports = {
  sequelize,
  User,
  PredictionHistory,
  initDatabase,
};
