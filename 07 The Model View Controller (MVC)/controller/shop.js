const Product = require("../models/product");

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/product-list", {
      prods: products,
      title: "Shop Products",
      path: "/products",
      hasProducts: products.length > 0,
      shopActive: true,
      addProductActive: false,
      productCss: true,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("shop/index", {
      prods: products,
      title: "Shop",
      path: "/",
    });
  });
};

exports.getCarts = (req, res, next) => {
  res.render("shop/cart", {
    title: "Your Cart",
    path: "/cart",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    title: "Checkout",
    path: "/checkout",
  });
};
