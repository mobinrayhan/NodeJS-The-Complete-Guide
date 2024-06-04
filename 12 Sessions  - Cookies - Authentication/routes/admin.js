const express = require("express");

const { userAuth } = require("../middleware/is-auth");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/products", userAuth, adminController.getProducts);

router.get("/add-product", userAuth, adminController.getAddProduct);
router.post("/add-product", userAuth, adminController.postAddProduct);

router.get(
  "/edit-product/:productId",
  userAuth,
  adminController.getEditProduct,
);
router.post("/edit-product", userAuth, adminController.postEditProduct);

router.post("/delete-product", userAuth, adminController.deleteProduct);

module.exports = router;
