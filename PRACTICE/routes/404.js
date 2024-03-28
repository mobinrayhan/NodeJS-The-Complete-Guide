const { Router } = require("express");
const path = require("path");
const { rootPath } = require("../helper/rootPath");

const router = Router();
router.get("*", (req, res) => {
  // res.sendFile(path.join(rootPath, "views", "404.html"));
  res.render("404");
});
exports.pageNotFound = router;
