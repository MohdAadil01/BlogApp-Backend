import Post from "../models/Post.js";

export const create = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(200).json("You are not allowed to create post.");
    }
    const { title, content } = req.body;
    if (title.trim() === "" || content.trim() == "") {
      return res.status(200).send("Please provide all fields");
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = await Post({
      title,
      content,
      slug,
      author: req.user.id,
    });
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(400).send("Error in creating post " + error);
  }
};

export const getposts = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortOrder = req.query.sort === "asc" ? 1 : -1;
    const query = {};
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.category) query.category = req.query.category;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.postId) query._id = req.query.postId;
    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }
    const foundPosts = await Post.find(query)
      .skip(start)
      .limit(limit)
      .sort({ updatedAt: sortOrder });

    const totalPosts = await Post.countDocuments();

    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      foundPosts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    res
      .status(400)
      .send("Error in getting all posts from the database " + error);
  }
};
export const deletepost = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    if (!req.user.isAdmin || req.user.id !== userId) {
      return res.status(400).json("You are not allowed to delete this post");
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).send("Successfully deleted the post.");
  } catch (error) {
    res.status(400).send("Error in creating post " + error);
  }
};
export const updatepost = async (req, res) => {
  try {
    const { postId, userId } = req.params;
    if (!req.user.isAdmin || req.user.id !== userId) {
      return res.status(200).json("You are not allowed to update this post");
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).send("Error in updated post " + error);
  }
};
