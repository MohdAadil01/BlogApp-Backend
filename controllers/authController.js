import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.trim() == "" || password.trim() == "") {
      res.send("Please Enter all fields");
    }
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.send("User does not exist, Please create your account first.");
    }
    const hashedPasswordFromDatabase = foundUser.password;
    bcrypt.compare(password, hashedPasswordFromDatabase, (err, result) => {
      if (err) {
        console.log("Error in matching password" + err);
      }
      if (!result) {
        res.send("Invalid Credentials.");
      }
      const { password, ...rest } = foundUser._doc;
      res.status(200).json(rest);
    });
  } catch (error) {
    res.json({ message: `Error in signing in ${error}` });
  }
};

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (username.trim() == "" || email.trim() == "" || password.trim() == "") {
      res.send("All fields are required");
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
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
      });
    });
  } catch (error) {
    res.json({ message: `Error in signing up ${error}` });
  }
};

export const google = (req, res) => {};
