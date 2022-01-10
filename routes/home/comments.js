const express = require("express");
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const router = express.Router();
const { guestComment } = require("../../controllers/commentController");

router.post("/:id", guestComment);

module.exports = router;
