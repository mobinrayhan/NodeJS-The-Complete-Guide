const express = require("express");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignUp);
router.post("/signup", postSignUp);
module.exports = router;
