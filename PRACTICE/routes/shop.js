const express = require("express");
const {
  getHomePage,
  getProductsPage,
  getOrders,
  getCartPage,
  getProductDetail,
} = require("../model/shop");
const { getProducts } = require("../model/admin");

const router = express.Router();

router.get("/", getHomePage);

router.get("/products", getProductsPage);
router.get("/products/:productId", getProductDetail);

router.get("/orders", getOrders);

router.get("/cart", getCartPage);

module.exports = router;
