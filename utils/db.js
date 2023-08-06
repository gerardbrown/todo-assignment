const { Sequelize } = require('sequelize');
const dbConfig = require("../config/config.json");

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
});

module.exports = sequelize;
