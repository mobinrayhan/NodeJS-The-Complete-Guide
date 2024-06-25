const { validationResult } = require("express-validator");
const Post = require("../model/post");
const User = require("../model/user");
const deleteImage = require("../util/deleteImage");

exports.getPosts = async (req, res, next) => {
  const page = req.query.page || 1;
  let postPerPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);

    res.status(200).json({
      posts,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postPosts = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error("Validation failed. entered data was incorrect!");
    error.statusCode = 403;
    throw error;
  }

  const { title, content } = req.body;

  const newPost = new Post({
    title,
    content,
    creator: req.userId,
    imageUrl: "images/" + req.file.filename,
  });

  try {
    const post = await newPost.save();
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("Could not found user!");
      error.statusCode = 404;
      throw error;
    }

    user.posts.push(post);
    await user.save();

    res.status(201).json({
      message: "Post create successfully ",
      post,
      creator: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Could not found post!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Post fetched", post });

    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUpdatePost = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error("Validation failed. entered data was incorrect!");
    error.statusCode = 403;
    throw error;
  }

  const { postId } = req.params;
  const { title, content, image } = req.body;

  let imageUrl = image;

  if (req.file) {
    imageUrl = "images/" + req.file.filename;
  }

  if (!imageUrl) {
    const error = new Error("No file picked!");
    error.statusCode = 422;
    throw error;
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not found post!");
      error.statusCode = 404;
      throw error;
    }
    if (!post) {
      const error = new Error("Could not found post!");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error("User not authenticated!!");
      error.statusCode = 500;
      throw error;
    }

    if (post.imageUrl !== imageUrl) {
      deleteImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    await post.save();

    res.status(200).json({ message: "Post Updated Successfully  !", post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not found post!");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error("User not authenticated!!");
      error.statusCode = 500;
      throw error;
    }

    deleteImage(post.imageUrl);

    await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
