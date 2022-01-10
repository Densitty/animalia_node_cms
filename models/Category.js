const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Your post must have a name."],
    unique: true,
    minlength: [3, "Category cannot have less than 3 characters."],
  },
});

categorySchema.set("toJSON", {
  virtuals: true,
});

categorySchema.set("toObject", {
  virtuals: true,
});

const Post = mongoose.model("Categories", categorySchema);

module.exports = Post;
