const path = require("node:path");
const fs = require("node:fs");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { totalPrice: 0, products: [] };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products.find((p) => p.id === id);

      let updatedProduct;

      if (existingProductIndex !== -1) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + parseInt(productPrice);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return null;

      const cartItems = JSON.parse(fileContent);

      const deletedProduct = cartItems.products.find((p) => p.id === id);

      cartItems.totalPrice =
        cartItems.totalPrice - deletedProduct.qty * productPrice; // remove item from the products array

      cartItems.products = cartItems.products.filter((p) => p.id !== id);

      fs.writeFile(p, JSON.stringify(cartItems), (err) => {
        console.log(err);
      });
    });
  }

  static getProducts(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return cb([]);
      } else {
        return cb(JSON.parse(fileContent));
      }
    });
  }
};
