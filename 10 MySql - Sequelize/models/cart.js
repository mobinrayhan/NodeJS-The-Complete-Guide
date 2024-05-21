const sequelize = require("../util/database");
const {DataTypes} = require("sequelize");

const Cart = sequelize.define("carts", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
});

module.exports = Cart;
