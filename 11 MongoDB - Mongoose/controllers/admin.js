const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    isEditMode: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const products = new Product(
    title,
    imageUrl,
    price,
    description,
    null,
    req.user._id,
  );
  products
    .save()
    .then((product) => {
      res.redirect("/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { edit } = req.query;

  if (!Boolean(edit)) {
    res.redirect("/admin/products");
    return;
  }

  Product.findById(productId).then((product) => {
    res.render("admin/add-edit-product", {
      pageTitle: "Edit Product",
      isEditMode: true,
      path: null,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description, id);
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const id = req.body.productId;

  Product.deleteById(id).then((result) => {
    res.redirect("/admin/products");
  });
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};
