import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const signin = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username.trim() || !email.trim() || !password.trim()) {
    res.send("All fields are required");
  }
};

export const signup = (req, res) => {};

export const google = (req, res) => {};
