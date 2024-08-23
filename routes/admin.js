import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { uploadFiles } from "../middlewares/multer.js"; // Import multer instance
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from "../controllers/admin.js";

const router = express.Router();

// Use the multer instance directly with single()
router.post("/course/new", isAuth, isAdmin, uploadFiles.single('file'), createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles.single('file'), addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get("/stats", isAuth, isAdmin, getAllStats);
router.put("/user/:id", isAuth, updateRole);
router.get("/users", isAuth, isAdmin, getAllUser);

export default router;
