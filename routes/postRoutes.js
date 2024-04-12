import express from "express";
import {
  create,
  deletepost,
  getposts,
  updatepost,
} from "../controllers/postController.js";
const router = express.Router();

router.post("/create", create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", deletepost);
router.put("/updatepost/:postId/:userId", updatepost);

export default router;
