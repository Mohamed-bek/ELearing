import { Router } from "express";
import {
  GetCourseById,
  GetCoursesByFilter,
  CreateCourse,
  addVideosToCourse,
} from "../controllers/CourseController.js";
import { upload } from "../middleware/multerConfig.js";

import { authenticateToken, authorizeRoles } from "../middleware/Auth.js";

const CourseRouter = Router();

CourseRouter.post(
  "/course/create",
  authenticateToken,
  authorizeRoles(["admin", "coach"]),
  upload.single("image"),
  CreateCourse
);
CourseRouter.put("/course/add_video/:id", addVideosToCourse);
CourseRouter.get("/courses/", GetCoursesByFilter);
CourseRouter.get("/course/:id", GetCourseById);

export default CourseRouter;
