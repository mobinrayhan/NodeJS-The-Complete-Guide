const sequelize = require("../util/database");
const { DataTypes } = require("sequelize");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
