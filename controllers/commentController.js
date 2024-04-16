import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.user.id) {
      return res.status(200).send("You are not allowed to create comment.");
    }
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    const comment = await newComment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).send("Error in creating comment " + error);
  }
};
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const foundComments = await Comment.find(postId).sort({
      createdAt: -1,
    });
    return res.status(200).json(foundComments);
  } catch (error) {
    res.status(400).send("Error in getting post comments " + error);
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const foundComment = await Comment.findById(commentId);
    if (!foundComment) {
      return res.status(200).send("No comments Found");
    }
    const user = foundComment.likes.indexOf(req.user.id);
    if (user === -1) {
      foundComment.numberOfLikes += 1;
      foundComment.likes.push(req.user.id);
    } else {
      foundComment.numberOfLikes -= 1;
      foundComment.likes.splice(user, 1);
    }
    await foundComment.save();
    res.status(200).json(foundComment);
  } catch (error) {
    res.status(400).send("Error in liking post comment " + error);
  }
};

export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const foundComment = await Comment.findById(commentId);
    if (!foundComment) {
      return res.status(200).send("Comment not found.");
    }
    if (foundComment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(200).send("You are not allowed to edit this comment");
    }
    const editedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content: req.body.content,
        },
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    res.status(400).send("Error in editing post comment " + error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const foundComment = await Comment.findById(commentId);
    if (!foundComment) {
      return res.status(200).send("Comment not found.");
    }
    if (foundComment.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(200).send("You are not allowed to delete this comment");
    }
    await Comment.findByIdAndDelete(commentId);
    res.status(200).send("Comment deleted successfully");
  } catch (error) {
    res.status(400).send("Error in deleting post comment " + error);
  }
};

export const getComments = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(200).send("You are not allowed to get all comments.");
  }
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortOrder = req.query.sort === "asc" ? 1 : -1;
    const comments = await Comment.find().skip(start).limit(limit).sort({
      createdAt: sortOrder,
    });
    const totalComments = await Comment.countDocuments();
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: oneMonthAgo,
    });
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    res.status(400).send("Error in getting all comments " + error);
  }
};
