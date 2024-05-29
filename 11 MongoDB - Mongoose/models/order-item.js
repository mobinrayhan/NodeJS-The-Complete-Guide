const sequelize = require("../util/database");
const { DataTypes } = require("sequelize");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.FLOAT,
});

module.exports = OrderItem;
