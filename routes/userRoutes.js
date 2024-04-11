import express from "express";
import {
  deleteUser,
  getSingleUser,
  signout,
  updateUser,
  getAllUsers,
} from "../controllers/userController.js";
const router = express.Router();

router.put("/update/:userId", updateUser);
router.delete("/delete/:userId", deleteUser);
router.post("/signout", signout);
router.get("/getallusers", getAllUsers);
router.get("/:userId", getSingleUser);

export default router;
