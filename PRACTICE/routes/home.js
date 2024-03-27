const { Router } = require("express");
const path = require("path");
const { rootPath } = require("../helper/rootPath");

const router = Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(rootPath, "views", "home.html"));
});

exports.homeRouter = router;
