const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    title: "Add Product",
    path: "/admin/add-product",
    shopActive: false,
    addProductActive: true,
    formCss: true,
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProduct((products) => {
    res.render("admin/products", {
      title: "Admin Product",
      prods: products,
      path: "/admin/admin-products",
    });
  });
};

exports.postAdminProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};
