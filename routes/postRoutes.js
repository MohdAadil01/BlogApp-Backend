import express from "express";
import {
  create,
  deletepost,
  getposts,
  updatepost,
} from "../controllers/postController.js";
import { verifyToken } from "../middlewares/token.js";
const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getallposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default router;
