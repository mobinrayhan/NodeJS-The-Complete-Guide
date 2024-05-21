const sequelize = require("../util/database");
const { DataTypes } = require("sequelize");

const CartItem = sequelize.define("cartItems", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  quantity: DataTypes.FLOAT,
});

module.exports = CartItem;
