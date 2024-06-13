const express = require("express");
const { body } = require("express-validator");

const { userAuth } = require("../middleware/is-auth");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/products", userAuth, adminController.getProducts);

router.get("/add-product", userAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  userAuth,
  [
    body("title", "Please enter your product title !!")
      .trim()
      .isLength({ min: 5, max: 40 })
      .isString(),

    body("price", "Please enter your price here !").trim().isDecimal(),
    body(
      "description",
      "Description should be at least 5 character and valid !!",
    )
      .trim()
      .isLength({ min: 5, max: 1000 })
      .isString(),
  ],
  adminController.postAddProduct,
);

router.get(
  "/edit-product/:productId",
  userAuth,
  adminController.getEditProduct,
);
router.post(
  "/edit-product",
  userAuth,
  [
    body("title", "Please enter your product title !!")
      .trim()
      .isLength({ min: 5, max: 40 })
      .isString(),
    body("price", "Please enter your price here !").trim().isDecimal(),
    body(
      "description",
      "Description should be at least 5 character and valid !!",
    )
      .trim()
      .isLength({ min: 5, max: 1000 })
      .isString(),
    body("productId", "Must need product id").isString(),
  ],
  adminController.postEditProduct,
);

router.post("/delete-product", userAuth, adminController.deleteProduct);

module.exports = router;
