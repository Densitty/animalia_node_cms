const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.getComments = async (req, res) => {
  const comments = await Comment.find({}).populate("user").lean();

  res.render("admin/comments", {
    comments,
  });
};

exports.guestComment = async (req, res) => {
  try {
    // find the post on which the comment is made
    const post = await Post.findOne({ _id: req.body.id });

    const guestComment = await Comment.create({
      // user: req.user.id /* the logged-in user's id */,
      nickname: req.body.nickname || "Guest",
      body: req.body.body /* body of text */,
    });

    // add the comment to the post
    await post.comments.push(guestComment);
    // save the comment

    await post.save();

    /* make a flash for successfully added comment */
    req.flash(
      "success_message",
      "Thank for commenting. Your comment is awaiting approval."
    );

    res.redirect(`/post/${post.slug}`);
  } catch (err) {
    console.log(err);
  }
};

exports.adminPostComment = async (req, res) => {
  console.log("This route is not working yet");
  // try {
  //   // find the post on which the comment is made
  //   const post = await Post.findById({ _id: req.body.id });
  //   console.log(req.params);
  //   // create the comment
  //   const newComment = await new Comment({
  //     user: req.user.id || req.body.nickname /* the logged-in user's id */,
  //     body: req.body.body /* body of text */,
  //   });

  //   console.log("New post is");
  //   console.log(post);

  //   // add the comment to the post
  //   await post.comments.push(newComment);
  //   // save the comment
  //   await newComment.save();
  //   await post.save();
  //   /* make a flash for successfully added comment */
  //   req.flash(
  //     "success_message",
  //     "Thank for commenting. Your comment is awaiting approval."
  //   );
  //   res.redirect(`/post/${post.id}`);
  // } catch (err) {
  //   console.log(err);
  // }
};

exports.deleteComment = async (req, res) => {
  try {
    // delete the comment
    await Comment.findByIdAndDelete({ _id: req.params.id });
    // find the post which has the comment and also remove it from the post
    await Post.findOneAndUpdate(
      { comments: req.params.id },
      {
        $pull: { comments: req.params.id },
      } /* $pull - remove from post the array of comments the comment that has been deleted */
    );
    res.redirect("/admin/comments");
  } catch (err) {
    console.log(err);
  }
};

exports.approveComment = async (req, res) => {
  const result = await Comment.findByIdAndUpdate(
    { _id: req.body.id },
    { $set: { approveComment: req.body.approveComment } }
  );
  // send the result object to the frontend
  res.send(result);
};
