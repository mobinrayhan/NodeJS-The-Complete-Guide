const Product = require("../controller/Product");

exports.getAddProducts = (req, res) => {
  const path = req.originalUrl;

  res.render("admin/add-edit-products.ejs", {
    pageTitle: "Add Products",
    path,
    isEditMode: false,
  });
};

exports.postProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(null, title, imageUrl, price, description);
  product.save();

  res.redirect("/");
};

exports.getProducts = (req, res) => {
  const path = req.originalUrl;

  Product.fetchAll((products) => {
    res.render("admin/admin-products.ejs", {
      pageTitle: "Add Products",
      path,
      products,
    });
  });
};

exports.getEditProducts = (req, res) => {
  const { productId } = req.params;

  Product.getById(productId, (product) => {
    res.render("admin/add-edit-products.ejs", {
      pageTitle: "Edit Product",
      path: "/",
      isEditMode: true,
      product,
    });
  });
};

exports.postEditProducts = (req, res) => {
  const id = req.body.productId;
  const { title, imageUrl, price, description } = req.body;

  const updateProduct = new Product(id, title, imageUrl, price, description);
  updateProduct.save();

  res.redirect("/products");
};

exports.deleteProduct = (req, res) => {
  const id = req.body.productId;

  Product.deleteById(id, () => {
    res.redirect("/products");
  });
};
