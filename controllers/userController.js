import User from "../models/User.js";
import mongoose from "mongoose";

export const getSingleUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(400).send("User does not exist");
    }
    const { password, ...rest } = foundUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(400).send({ message: "Error in getting User " + error });
  }
};
export const getAllUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(400).send("You are not allowed to see all users");
  }
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
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (req.user.id !== userId) {
      return res.status(400).send("Your are not allowed to update this user");
    }
    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
          email: req.body.email,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(400).send("Error in updating the user " + error);
  }
};
export const deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return res.send("You are not allowed to delelte the user");
    }
    await User.findByIdAndDelete(
      new mongoose.Types.ObjectId(req.params.userId)
    );
    res.status(200).send("User has been deleted");
  } catch (error) {
    res.status(400).send("Error in deleting the user " + error);
  }
};
export const signout = async (req, res) => {
  try {
    res.clearCookie("acces_token").status(200).send("Sign out successfully.");
  } catch (error) {
    res.status(400).send("Error in signing out the user " + error);
  }
};
