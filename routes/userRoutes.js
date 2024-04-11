import express from "express";
import {
  test,
  deleteUser,
  getUser,
  signout,
  updateUser,
  getUsers,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", updateUser);
router.delete("/delete/:userId", deleteUser);
router.post("/signout", signout);
router.get("/getusers", getUsers);
router.get("/:userId", getUser);

export default router;
