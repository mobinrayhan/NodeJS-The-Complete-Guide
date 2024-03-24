const path = require("path");

const { Router } = require("express");

const { rootPath } = require("../helper/rootPath");

const router = Router();

router.get("/users", (req, res) => {
  res.sendFile(path.join(rootPath, "views", "users.html"));
});

exports.usersRouter = router;
