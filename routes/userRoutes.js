import express from "express";
import {
  deleteUser,
  getSingleUser,
  signout,
  updateUser,
  getAllUsers,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/token.js";
const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getallusers", verifyToken, getAllUsers);
router.get("/:userId", getSingleUser);

export default router;
