const Product = require("../models/product");
const Order = require("../models/orders");
const User = require("../models/user");

const fs = require("node:fs");
const path = require("node:path");
const { createInvoice } = require("../util/createInvoice");

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
        orders: orders,
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

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized user!"));
      } else {
        const invoiceName = `invoice-${orderId}.pdf`;
        const invoicePath = path.join("data", "invoices", invoiceName);

        User.findById(order.user.userId.toString()).then((user) => {
          const items = order.products.map((p) => {
            return {
              item: p.product.title,
              description: p.product.description,
              quantity: p.quantity,
              amount: +p.product.price,
            };
          });
          const totalsFromItems = items.reduce(
            (prevValue, curr) => prevValue + curr.amount,
            0,
          );

          const invoice = {
            shipping: {
              name: user.email,
              address: "Kishoreganj, Karimgonj",
              city: "Dhaka",
              state: "KG",
              country: "BD",
              postal_code: 94111,
            },
            items,
            subtotal: totalsFromItems,
            paid: Math.round(totalsFromItems / 3),
            invoice_nr: orderId,
          };

          createInvoice({ invoice, path: invoicePath, invoiceName, res });
        });
      }
    })
    .catch((err) => next(err));
};
