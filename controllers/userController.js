import User from "../models/User.js";
import mongoose from "mongoose";

export const getSingleUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      res.status(400).send("User does not exist");
    }
    const { password, ...rest } = foundUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(400).send({ message: "Error in getting User " + error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortOrder = req.query.sort === "asc" ? 1 : -1;

    const allUsers = await User.find()
      .sort({ createdAt: sortOrder })
      .skip(start)
      .limit(limit);
    const usersWithoutPassword = allUsers.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    res.status(400).send({ message: "Error in getting All Users " + error });
  }
};
export const updateUser = async (req, res) => {};
export const deleteUser = async (req, res) => {};
export const signout = async (req, res) => {};