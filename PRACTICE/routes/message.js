const { Router } = require("express");
const { writeFileSync } = require("fs");
const path = require("path");

const router = Router();

router.post("/message", (req, res, next) => {
  // writeFileSync("message.txt", req.body.message);
  // res.sendFile(path.join(rootPath, "views", "message.html"));
  res.render("message", { message: req.body.message });
});

exports.messageRoute = router;
