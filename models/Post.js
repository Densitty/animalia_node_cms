const mongoose = require("mongoose");
const URLSlugs = require("mongoose-url-slugs");
const slugify = require("slugify");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Your post must have a title."],
  },
  image: String,
  status: {
    type: String,
    default: "public",
  },
  allowComments: {
    type: Boolean,
  },
  body: {
    type: String,
    required: [true, "Your post must have a body."],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  slug: {
    type: String,
  },
});

postSchema.set("toJSON", {
  virtuals: true,
});

postSchema.set("toObject", {
  virtuals: true,
});

postSchema.plugin(URLSlugs("title", { field: "slug" }));
// postSchema.pre("save", function (next) {
//   this.slug = slugify(this.title, { lower: true });
//   next();
// });

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
