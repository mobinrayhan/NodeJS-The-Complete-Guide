const path = require("path");

const { Router } = require("express");

const router = Router();

router.get("/add-product", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});

router.post("/add-product", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
