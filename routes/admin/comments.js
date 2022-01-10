const express = require("express");
const router = express.Router();
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const { userAuthenticated } = require("../../utilities/authentication");

const {
  approveComment,
  getComments,
  adminPostComment,
  deleteComment,
} = require("../../controllers/commentController");

router.get("/", getComments);

router.post("/:id", adminPostComment);

router.delete("/:id", deleteComment);

router.post("/approve-comment", approveComment);

module.exports = router;
