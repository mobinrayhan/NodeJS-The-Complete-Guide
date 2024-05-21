const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);
router.post("/delete-product", shopController.postDeleteProduct);

router.get("/cart", shopController.getCart);
router.post("/add-to-cart", shopController.addToCart);
router.post("/delete-cart-product", shopController.postDeleteCartProduct);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

router.get("/products/:id", shopController.productDetails);

module.exports = router;
