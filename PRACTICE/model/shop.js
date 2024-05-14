const Product = require("../controller/Product");

exports.getHomePage = (req, res) => {
  const path = req.originalUrl;

  Product.fetchAll((products) => {
    res.render("shop/index.ejs", {
      pageTitle: "Home",
      path,
      products,
    });
  });
};

exports.getProductsPage = (req, res) => {
  const path = req.originalUrl;

  Product.fetchAll((products) => {
    res.render("shop/products.ejs", {
      pageTitle: "All Products",
      path,
      products,
    });
  });
};

exports.getProductDetail = (req, res) => {
  const { productId } = req.params;

  Product.getById(productId, (product) => {
    res.render("shop/details.ejs", {
      pageTitle: "All Products",
      path: "/products",
      product,
    });
  });
};

exports.getOrders = (req, res) => {
  const path = req.originalUrl;

  res.render("shop/orders.ejs", {
    pageTitle: "Orders",
    path,
  });
};

exports.getCartPage = (req, res) => {
  const path = req.originalUrl;

  res.render("shop/cart.ejs", {
    pageTitle: "Cart",
    path,
  });
};
