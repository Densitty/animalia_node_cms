// const express = require("express");
// // const router = express.Router();
const Post = require("../models/Post");
const Category = require("../models/Category");
const User = require("../models/User");
const fs = require("fs");

const {
  isEmpty,
  isImage,
  imageUploadable,
  uploadDir,
} = require("../utilities/imageUploadHelper");

exports.displayPosts = async (req, res) => {
  res.locals.title = "Learn Everything Animal Related";
  const postsPerPage = 5;
  const page = req.query.page || 1; /* query is a string */

  try {
    const posts = await Post.find({})
      .skip(postsPerPage * page - postsPerPage)
      .limit(postsPerPage)
      .populate("user");

    const postsCount = await Post.count();

    const categories = await Category.find({});
    res.render("home", {
      posts: posts.map((post) => post.toJSON()),
      categories: categories.map((cat) => cat.toJSON()),
      current: parseInt(page),
      pages: Math.ceil(postsCount / postsPerPage),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.displayPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("user") /* populate post author */
      .populate({
        path: "comments",
        match: { approveComment: true },
        populate: { path: "user", model: "User" } /* populate comment author */,
      });

    const categories = await Category.find({});

    res.locals.title = post.title;

    res.render("home/post", {
      post: post,
      categories: categories.map((cat) => cat.toJSON()),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAdminPosts = async (req, res) => {
  /* pull data from database */
  try {
    /* const posts = await Post.find({}).lean();
    res.render("admin/posts", { posts }); */
    const posts = await Post.find({}).populate("category");

    res.render("admin/posts", { posts: posts.map((post) => post.toJSON()) });
  } catch (err) {
    console.log(err);
  }
};

exports.createPost = async (req, res) => {
  const categories = await Category.find({});

  res.render("admin/posts/create", {
    categories: categories.map((cat) => cat.toJSON()),
  });
};

exports.publishPost = async (req, res) => {
  let file;
  let filename;
  const errors = [];
  try {
    if (!req.body.title) {
      errors.push({ message: "Please add a title." });
    }

    if (!req.body.body) {
      errors.push({ message: "Please add your story." });
    }

    if (errors.length > 0) {
      res.render("admin/posts/create", {
        errors: errors,
      });
    } else {
      if (req.files) {
        file = req.files.file;
        const imageSelected = isEmpty(file);
        const requiredFile = isImage(file);
        const imageIsOfRequiredSize = imageUploadable(file);

        /* "./public/uploads/image001.jpg" */
        filename = `${Date.now()}_${file.name}`;

        if (imageSelected && requiredFile && imageIsOfRequiredSize) {
          file.mv("./public/uploads/" + filename, (err) => {
            if (err) throw err;
          });
        }
      }

      const title = req.body.title;
      const image = filename || "image001.jpg";
      const status = req.body.status;
      const allowComments = req.body.allowComments ? true : false;
      const body = req.body.body;
      const user = req.user.id;
      const post = await new Post({
        title,
        image,
        status,
        allowComments,
        body,
        user,
        category: req.body.category,
      });
      await post.save();
      req.flash(
        "success_message",
        `Post, ${post.title}, successfully created.`
      );
      res.redirect("/admin/posts");
    }
  } catch (err) {
    console.log(err.errors);

    // Errors can be rendered from the err object, onto the client, or we do it as above
    /* res.render("admin/posts/create", {
      errors: err.errors,
    }); */
  }
};

exports.editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById({ _id: id }).lean();
    const categories = await Category.find({});
    /* render the post found onto the form */
    res.render("admin/posts/edit", {
      post,
      categories: categories.map((cat) => cat.toJSON()),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.publishEditedPost = async (req, res) => {
  console.log(req.body);
  const { title, status, body, allowComments, category } = req.body;
  try {
    const id = req.params.id;
    const post = await Post.findByIdAndUpdate(
      { _id: id },
      {
        title,
        status,
        body,
        allowComments: allowComments ? true : false,
        user: req.user.id,
        category,
      },
      { new: true, runValidators: true }
    ).lean();

    req.flash("success_message", `Post, ${post.title}, successfully updated.`);

    res.redirect("/admin/posts");
  } catch (err) {
    console.log(err.errors);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete({ _id: req.params.id }).populate(
      "comments"
    );

    /* remove the comment associated with a post when removing a post */
    if (post.comments.length > 0) {
      await post.comments.forEach((comment) => {
        comment.remove();
      });
    }

    if (!post.image.startsWith("image001")) {
      // if image is uploaded alongside the post/story, delete the image when deleting the post
      fs.unlink(`${uploadDir}/${post.image}`, (err) => {
        if (err) throw new Error(err);
        res.redirect("/admin/posts");
      });
    } else {
      // if image is default, don't delete the default image
      res.redirect("/admin/posts");
    }

    req.flash("success_message", `Post, ${post.title}, successfully deleted.`);
  } catch (err) {
    console.log(err);
  }
};
