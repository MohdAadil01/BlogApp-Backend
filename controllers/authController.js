import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.trim() == "" || password.trim() == "") {
      return res.status(400).json({ error: "Please Enter all fields" });
    }
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({
        error: "User does not exist, Please create your account first.",
      });
    }
    const hashedPasswordFromDatabase = foundUser.password;
    bcrypt.compare(password, hashedPasswordFromDatabase, (err, result) => {
      if (err) {
        console.log("Error in matching password" + err);
      }
      if (!result) {
        return res.status(400).json({ error: "Invalid Credentials." });
      }
      const token = jwt.sign(
        { id: foundUser._id, isAdmin: foundUser.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password, ...rest } = foundUser._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json({ rest, token });
    });
  } catch (error) {
    res.json({ message: `Error in signing in ${error}` });
  }
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(400)
        .json({ error: "User already exist, please Sign in." });
    }
    const salt = bcrypt.genSalt(10);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hashedPassword) => {
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });
        const user = await newUser.save();
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET_KEY
        );
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .cookie("access-token", token, { httpOnly: true })
          .json({ rest, token });
      });
    });
  } catch (error) {
    res.json({ message: `Error in signing up ${error}` });
  }
};

export const google = (req, res) => {};
