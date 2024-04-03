const express = require("express");
const {
  getIndex,
  getProducts,
  getCarts,
  getCheckout,
} = require("../controller/shop");

const router = express.Router();

router.get("/", getIndex);
router.get("/products", getProducts);
router.get("/cart", getCarts);
router.get("/checkout", getCheckout);

module.exports = router;
