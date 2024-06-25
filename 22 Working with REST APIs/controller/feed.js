const { validationResult } = require("express-validator");
const Post = require("../model/post");
const User = require("../model/user");
const deleteImage = require("../util/deleteImage");

exports.getPosts = (req, res, next) => {
  const page = req.query.page || 1;
  let postPerPage = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((numberOfPost) => {
      totalItems = numberOfPost;
      return Post.find()
        .skip((page - 1) * postPerPage)
        .limit(postPerPage);
    })
    .then((posts) => {
      res.status(200).json({
        posts,
        totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postPosts = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error("Validation failed. entered data was incorrect!");
    error.statusCode = 403;
    throw error;
  }

  const { title, content } = req.body;
  const newPost = {
    title,
    content,
    creator: req.userId,
    imageUrl: "images/" + req.file.filename,
  };

  const post = new Post(newPost);

  let creator;
  post
    .save()
    .then((post) => {
      return User.findById(req.userId).then((user) => {
        if (!user) {
          const error = new Error("Could not found user!");
          error.statusCode = 404;
          throw error;
        }
        creator = user;
        user.posts.push(post);
        return user.save();
      });
    })
    .then(() => {
      res.status(201).json({
        message: "Post create successfully ",
        post,
        creator: {
          id: creator._id,
          name: creator.name,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not found post!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched", post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postUpdatePost = (req, res, next) => {
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

  Post.findById(postId)
    .then((post) => {
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
      return post.save();
    })
    .then((post) => {
      res.status(200).json({ message: "Post Updated Successfully  !", post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((post) => {
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
      return Post.findByIdAndDelete(postId);
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })

    .then(() => {
      res.status(200).json({ message: "Post Deleted Successfully" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
