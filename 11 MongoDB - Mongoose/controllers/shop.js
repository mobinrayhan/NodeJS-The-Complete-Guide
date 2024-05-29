const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.productDetails = (req, res, next) => {
  const productId = req.params.id;

  Product.findById(productId).then((product) => {
    res.render("shop/product-detail", {
      pageTitle: product.title,
      path: "/products",
      product: product,
    });
  });
};

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      return res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products,
      });
    })

    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.destroy({ where: { id: productId } }).then((result) => {
    console.log(result);
    res.redirect("/cart");
  });
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId).then((result) => {
    req.user
      .addToCart(result)
      .then((cart) => {
        res.redirect("/cart");
      })
      .catch((err) => console.log(err));
  });
};

exports.postDeleteCartProduct = (req, res) => {
  const { productId } = req.body;

  req.user.deleteCartItem(productId).then(() => {
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders,
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user.addOrder().then(() => {
    res.redirect("/orders");
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
