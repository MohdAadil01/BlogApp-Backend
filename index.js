import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDatabase from "./lib/db.js";
import authRoutes from "./routes/authRoute.js";
const app = express();

dotenv.config();
app.use(bodyParser.json());

connectDatabase();

// app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/comment', commentRoutes);

app.listen(process.env.PORT, () => {
  console.log("Running");
});
