const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" /* User - the name of the model */,
    // required: true,
  },

  nickname: {
    type: String,
    default: "Guest",
  },

  body: {
    type: String,
    required: [true, "Your post must have a name."],
    minlength: [3, "Category cannot have less than 3 characters."],
  },

  date: {
    type: Date,
    default: Date.now(),
  },

  approveComment: {
    type: Boolean,
    default: false,
  },
});

commentSchema.set("toJSON", {
  virtuals: true,
});

commentSchema.set("toObject", {
  virtuals: true,
});

const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;
