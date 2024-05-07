const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.productDetails = (req, res, next) => {
  const productId = req.params.id;

  Product.getById(productId, (product) => {
    console.log(product);
    res.render("shop/product-detail", {
      pageTitle: product?.title,
      path: "/products",
      product,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Product.fetchAll((products) => {
    Cart.getProducts((cartProds) => {
      let updatedCartProducts = [];

      for (const product of products) {
        const cartProduct = cartProds.products.find((p) => p.id === product.id);

        if (cartProduct) {
          updatedCartProducts.push({
            cartProduct,
            title: product.title,
            price: cartProduct.qty * product.price,
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        updatedCartProducts,
      });
    });
  });
};

exports.addToCart = (req, res, next) => {
  const { productId } = req.body;

  Product.getById(productId, (product) => {
    Cart.addProduct(productId, product.price);
    res.redirect("/cart");
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.getById(productId, (prod) => {
    Cart.deleteProduct(productId, prod?.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
