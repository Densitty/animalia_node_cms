const express = require("express");
const router = express.Router();
const Post = require("./../../models/Post");
const Category = require("./../../models/Category");
const Comment = require("./../../models/Comment");
const faker = require("faker");
const { userAuthenticated } = require("../../utilities/authentication");

/* override the default view to display different view for admin */
router.all(
  "/*",
  /*  userAuthenticated, */ (req, res, next) => {
    req.app.locals.layout = "admin";
    next();
  }
);

/* home for admin is "/admin"; "/" === "/admin" */
router.get("/", async (req, res) => {
  const postCount = await Post.count().exec();
  const commentCount = await Comment.count().exec();
  const categoryCount = await Category.count().exec();

  // const values = await Promise.all([postCount, commentCount, categoryCount]);

  res.render("admin/index", { postCount, commentCount, categoryCount });
});

/* generate fake posts */
router.post("/generate-fake-posts", async (req, res) => {
  try {
    for (let i = 0; i < req.body.amount; i++) {
      const fakePost = await new Post({
        title: faker.name.title(),
        status: "public",
        allowComments: faker.datatype.boolean(),
        body: faker.lorem.sentences(),
        slug: faker.name.title(),
      });
      await fakePost.save();
    }
    res.redirect("/admin/posts");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
