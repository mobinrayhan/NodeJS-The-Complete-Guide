const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    title: "Add Product",
    path: "/admin/add-product",
    shopActive: false,
    addProductActive: true,
    formCss: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.showProducts = (req, res, next) => {
  res.render("shop", {
    prods: products,
    title: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    shopActive: true,
    addProductActive: false,
    productCss: true,
  });
};
