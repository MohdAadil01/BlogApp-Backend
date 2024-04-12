import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDatabase from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(cookieParser());

connectDatabase();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
// app.use('/api/comment', commentRoutes);

app.listen(process.env.PORT, () => {
  console.log("Running");
});
