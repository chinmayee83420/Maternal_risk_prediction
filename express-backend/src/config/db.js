const { Sequelize } = require('sequelize');
require('dotenv').config();

let dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/maternal_db';

if (dbUrl.startsWith('postgres://')) {
  dbUrl = dbUrl.replace('postgres://', 'postgresql://');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 10000,
    idle: 10000,
  },
});

module.exports = { sequelize };
