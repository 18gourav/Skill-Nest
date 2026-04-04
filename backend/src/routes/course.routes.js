import { Router } from "express";
import {
  getAdminCoursesOverview,
  createCourse,
  deleteCourse,
  enrollCourse,
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  updateCourse,
} from "../controllers/course.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/authorization.middleware.js";

const router = Router();

// Public route for listing courses
router.route("/").get(getAllCourses);

// Enroll and dashboard support
router.route("/enroll/:courseId").post(verifyJWT, enrollCourse);
router.route("/my/enrolled").get(verifyJWT, getEnrolledCourses);
router.route("/admin/overview").get(verifyJWT, verifyAdmin, getAdminCoursesOverview);

// Admin CRUD routes
router.route("/").post(verifyJWT, verifyAdmin, createCourse);
router.route("/:courseId").patch(verifyJWT, verifyAdmin, updateCourse);
router.route("/:courseId").delete(verifyJWT, verifyAdmin, deleteCourse);
router.route("/:courseId").get(getCourseById);

export default router;
