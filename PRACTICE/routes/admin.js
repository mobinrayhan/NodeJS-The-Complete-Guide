const express = require("express");
const {
  getAddProducts,
  getProducts,
  postProduct,
  getEditProducts,
  postEditProducts,
  deleteProduct,
} = require("../model/admin");

const router = express.Router();

router.get("/add-product", getAddProducts);
router.post("/add-product", postProduct);

router.get("/products", getProducts);

router.get("/edit-products/:productId", getEditProducts);
router.post("/edit-product", postEditProducts);

router.post("/delete-products", deleteProduct);

module.exports = router;
