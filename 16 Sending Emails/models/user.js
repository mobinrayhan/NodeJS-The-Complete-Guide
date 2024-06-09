const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          require: true,
          ref: "Product",
        },
        quantity: {
          required: true,
          type: Number,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const existingProdIndex = this.cart.items.findIndex(
    (p) => p.productId.toString() === product._id.toString(),
  );

  const updatedCartItems = [...this.cart.items];

  let newQueantity = 1;
  if (existingProdIndex >= 0) {
    newQueantity = this.cart.items[existingProdIndex].quantity + newQueantity;
    updatedCartItems[existingProdIndex].quantity = newQueantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQueantity });
  }

  const updateCart = { items: updatedCartItems };
  this.cart = updateCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (productId) {
  const cartItems = [...this.cart.items];
  const updatedItems = cartItems.filter(
    (i) => i.productId.toString() !== productId.toString(),
  );

  this.cart.items = updatedItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
