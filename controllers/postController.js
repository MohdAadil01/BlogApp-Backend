import Post from "../models/Post";

export const create = async (req, res) => {
  const { title, content } = req.body;
  if (title.trim() === "" || content.trim() == "") {
    res.status(400).send("Please provide all fields");
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
};

export const getposts = async (req, res) => {};
export const deletepost = async (req, res) => {};
export const updatepost = async (req, res) => {};
