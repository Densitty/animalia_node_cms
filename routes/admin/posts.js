const express = require("express");
const router = express.Router();
const {
  getAdminPosts,
  createPost,
  publishPost,
  editPost,
  publishEditedPost,
  deletePost,
} = require("../../controllers/postController");

router.all("/*", (req, res, next) => {
  res.app.locals.layout = "admin";
  next();
});

/* post is a route inside admin- '/admin/posts' */
router.get("/", getAdminPosts);

/* Get the 'create a story' page */
router.get("/create", createPost);

/* Post a story */
router.post("/create", publishPost);

/* Get the post to be updated */
router.get("/edit/:id", editPost);

/*  */
router.patch("/edit/:id", publishEditedPost);

/* delete a post/story */
router.delete("/:id", deletePost);

module.exports = router;
