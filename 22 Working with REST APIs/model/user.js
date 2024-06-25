const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const useSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    status: {
      // required: true,
      type: String,
      default: "I'm New here",
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", useSchema);
module.exports = User;
