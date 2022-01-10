const express = require("express");
const {
  register,
  displayAbout,
  login,
  signup,
  signin,
  logout,
} = require("../../controllers/authController");
const {
  displayPosts,
  displayPost,
} = require("../../controllers/postController");
const router = express.Router();

/* Set layout for the homepage too */
router.all("/*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", displayPosts);

router.get("/post/:slug", displayPost);

router.get("/about", displayAbout);

router.get("/login", login);

router.post("/login", signin);

router.get("/register", register);

router.post("/register", signup);

router.get("/logout", logout);

module.exports = router;
