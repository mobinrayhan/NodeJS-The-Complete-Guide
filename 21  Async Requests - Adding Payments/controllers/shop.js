const Product = require("../models/product");
const Order = require("../models/orders");
const User = require("../models/user");
const path = require("node:path");
const { createInvoice } = require("../util/createInvoice");
const { request } = require("express");
const stripe = require("stripe")(
  `sk_test_51PRvP3LOuWP2kFiQDjvneHbzKp0mLl7XmlWixv3IH8uLTbrH9zLwWPJyj9dj4lYvuuXyU5Q4HJ7ONt59bWZiU8hV00dTcu52w3`,
);
const PRODUCT_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((countResult) => {
      totalItems = countResult;
      return Product.find()
        .skip((page - 1) * PRODUCT_PER_PAGE)
        .limit(PRODUCT_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        currentPage: page,
        hasPrev: page > 1,
        prevPage: page - 1,
        hasNext: Math.ceil(totalItems / PRODUCT_PER_PAGE) > page,
        nextPage: page + 1,
        lastPage: Math.ceil(totalItems / PRODUCT_PER_PAGE),
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

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((countResult) => {
      totalItems = countResult;
      return Product.find()
        .skip((page - 1) * PRODUCT_PER_PAGE)
        .limit(PRODUCT_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasPrev: page > 1,
        prevPage: page - 1,
        hasNext: Math.ceil(totalItems / PRODUCT_PER_PAGE) > page,
        nextPage: page + 1,
        lastPage: Math.ceil(totalItems / PRODUCT_PER_PAGE),
      });
    })
    .catch((err) => {
      console.log(err);
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
      const orderProducts = ordersorders
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .map((order) => order.products);

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

exports.getCheckout = (req, res, next) => {
  req.user.populate("cart.items.productId").then((user) => {
    const products = user.cart.items;

    let total = 0;
    products.forEach((p) => {
      total += p.quantity * p.productId.price;
    });

    res.render("shop/checkout", {
      path: "/checkout",
      pageTitle: "Checkout",
      products,
      totalSum: total,
    });
  });
};

exports.postOrder = async (req, res, next) => {
  const products = await req.user.populate("cart.items.productId");

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

  await new Order({ products: finalProduct, user }).save();

  const totalPrice = finalProduct.reduce(
    (prevAmount, acc) => prevAmount + acc.product.price * acc.quantity,
    0,
  );

  try {
    const stripeProd = await stripe.products.create({
      name: "Random Name",
      description: "Random Description",
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProd.id,
      currency: "usd",
      unit_amount: totalPrice * 100,
    });

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: "http://localhost:3000/orders",
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: "payment",
    });

    res.redirect(303, stripeSession.url);
  } catch (err) {
    console.log(err);
  }
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
