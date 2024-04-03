const express = require("express");
const {
  getAddProduct,
  postAdminProduct,
  getProducts,
} = require("../controller/admin");

const router = express.Router();

router.get("/add-product", getAddProduct);
router.get("/admin-products", getProducts);
router.post("/add-product", postAdminProduct);

exports.routes = router;
