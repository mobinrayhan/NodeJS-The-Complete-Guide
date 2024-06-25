const express = require("express");
const {
  getPosts,
  postPosts,
  getPost,
  postUpdatePost,
  deletePost,
} = require("../controller/feed");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");
const router = express.Router();

router.get("/posts", isAuth, getPosts);

router.post(
  "/post",

  [
    body("title", "Title should be at least five character long")
      .trim()
      .isLength({ min: 5 }),
    body("content", "Content should be at least five character long")
      .trim()
      .isLength({ min: 5 }),
  ],
  isAuth,
  postPosts,
);
router.get("/post/:postId", isAuth, getPost);
router.put(
  "/post/:postId",
  [
    body("title", "Title should be at least five character long")
      .trim()
      .isLength({ min: 5 }),
    body("content", "Content should be at least five character long")
      .trim()
      .isLength({ min: 5 }),
  ],
  isAuth,
  postUpdatePost,
);

router.delete("/post/:postId", isAuth, deletePost);

module.exports = router;
