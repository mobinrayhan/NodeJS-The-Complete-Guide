const Product = require("../models/product");
const Order = require("../models/orders");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.productDetails = (req, res, next) => {
  const productId = req.params.id;

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getIndex = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((products) => {
      const finalProduct = products.cart.items;
      return res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: finalProduct,
      });
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.addToCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((result) => {
      req.user
        .addToCart(result)
        .then((cart) => {
          res.redirect("/cart");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.postDeleteCartProduct = (req, res) => {
  const { productId } = req.body;

  req.user.deleteCartItem(productId).then(() => {
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      const orderProducts = orders.map((order) => order.products);

      const totalPrice = orderProducts
        .map((order) => {
          return order.reduce(
            (totalPrice, ord) =>
              +totalPrice + ord.quantity * +ord.product.price,
            0,
          );
        })
        .at(0);

      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orderProducts,
        totalPrice,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((products) => {
      const finalProduct = products.cart.items.map((prod) => {
        return {
          quantity: prod.quantity,
          product: { ...prod.productId._doc },
        };
      });

      const user = {
        email: req.user.email,
        userId: req.user,
      };

      const order = new Order({ products: finalProduct, user });
      return order.save();
    })
    .then(() => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    });
};
