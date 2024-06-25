const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
      minLength: 5,
    },
    imageUrl: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
      minLength: 5,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
