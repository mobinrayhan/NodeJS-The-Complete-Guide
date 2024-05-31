const mongoose = require("mongoose");
const ordersSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  user: {
    name: {
      required: true,
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Order", ordersSchema);
