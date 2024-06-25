const Product = require("../models/product");
const { validationResult } = require("express-validator");
const { deleteFile } = require("../util/deleteFile");

exports.getAddProduct = (req, res) => {
  res.render("admin/add-edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,

    message: "",
    product: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
    isError: false,
    isEditMode: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.render("admin/add-edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      message: "Attached file not a image!",
      product: {
        title,
        imageUrl: "",
        price,
        description,
      },
      isError: true,
      isEditMode: false,
    });
  }

  const imageUrl = image.destination + image.filename;
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("admin/add-edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      message: result.array()[0].msg,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      isError: true,
      isEditMode: false,
    });
  }

  const products = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.user,
  });
  products
    .save()
    .then(() => {
      res.redirect("/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { edit } = req.query;

  if (!Boolean(edit)) {
    res.redirect("/admin/products");
    return;
  }

  Product.findById(productId)
    .then((product) => {
      if (req.user._id.toString() !== product.userId.toString()) {
        res.redirect("/admin/products");
        return;
      }

      res.render("admin/add-edit-product", {
        pageTitle: "Edit Product",
        isEditMode: true,
        path: null,
        message: "",
        product,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("admin/add-edit-product", {
      pageTitle: "Edit Product",
      isEditMode: true,
      path: null,
      message: result.array()[0].msg,
      product: {
        title,
        price,
        description,
        _id: id,
      },
    });
  }

  Product.findById(id)
    .then((product) => {
      if (req.user._id.toString() !== product.userId.toString()) {
        res.redirect("/admin/products");
        return;
      }

      product.title = title;
      if (image) {
        deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }

      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  console.log(id);

  Product.findById(id)
    .then((product) => {
      return deleteFile(product.imageUrl);
    })
    .then(() => {
      Product.deleteOne({ _id: id, userId: req.user._id }).then(() => {
        res.status(200).json({ message: "Product Deleted Successfully!" });
      });
    })
    .catch(() => {
      res.status(500).json({ message: "Product Deleted Successfully!" });
    });
};

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user._id })

    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};
