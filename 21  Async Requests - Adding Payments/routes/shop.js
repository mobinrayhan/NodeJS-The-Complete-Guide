const express = require("express");

const shopController = require("../controllers/shop");
const { userAuth } = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", userAuth, shopController.getCart);
router.post("/add-to-cart", userAuth, shopController.addToCart);

router.post(
  "/delete-cart-product",
  userAuth,
  shopController.postDeleteCartProduct,
);

router.get("/orders", userAuth, shopController.getOrders);
router.post("/create-order", userAuth, shopController.postOrder);
router.get("/orders/:orderId", userAuth, shopController.getInvoice);

router.get("/checkout", userAuth, shopController.getCheckout);

router.get("/products/:id", shopController.productDetails);

module.exports = router;
