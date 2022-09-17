const { Sequelize } = require('sequelize');

// Create a connection to database
//URL postgresql://postgres:cY38BxiCeAXuoZX8UZZO@containers-us-west-70.railway.app:6584/railway
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://postgres:cY38BxiCeAXuoZX8UZZO@containers-us-west-70.railway.app:6584/railway',
  {
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = { db };