const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PredictionHistory = sequelize.define('PredictionHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  age: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  systolic_bp: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  diastolic_bp: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  blood_sugar: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  body_temp: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  heart_rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  raw_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  risk_level: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  recommendation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'prediction_history',
  timestamps: true,
  updatedAt: false,
});

PredictionHistory.prototype.toFormattedJSON = function () {
  return {
    id: this.id,
    user_id: this.userId,
    inputs: {
      age: this.age,
      systolic_bp: this.systolic_bp,
      diastolic_bp: this.diastolic_bp,
      blood_sugar: this.blood_sugar,
      body_temp: this.body_temp,
      heart_rate: this.heart_rate,
    },
    raw_score: this.raw_score,
    risk_level: this.risk_level,
    recommendation: this.recommendation,
    created_at: this.createdAt ? this.createdAt.toISOString() : null,
  };
};

module.exports = PredictionHistory;
