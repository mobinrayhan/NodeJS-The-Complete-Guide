const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node_js", "root", "mobin123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
