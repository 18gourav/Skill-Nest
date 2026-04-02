import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, mentor } = req.body;

  if ([title, description, mentor].some((field) => !field || field?.trim() === "") || price === undefined) {
    throw new apiError(400, "Title, description, mentor and price are required");
  }

  const course = await Course.create({
    title,
    description,
    price,
    mentor,
    createdBy: req.user?._id,
  });

  return res.status(201).json(new apiResponse(201, course, "Course created successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });

  return res.status(200).json(new apiResponse(200, courses, "Courses fetched successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);

  if (!course) {
    throw new apiError(404, "Course not found");
  }

  return res.status(200).json(new apiResponse(200, course, "Course fetched successfully"));
});

const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, mentor } = req.body;

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      $set: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(mentor !== undefined ? { mentor } : {}),
      },
    },
    { new: true }
  );

  if (!updatedCourse) {
    throw new apiError(404, "Course not found");
  }

  return res.status(200).json(new apiResponse(200, updatedCourse, "Course updated successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const deletedCourse = await Course.findByIdAndDelete(courseId);

  if (!deletedCourse) {
    throw new apiError(404, "Course not found");
  }

  await User.updateMany(
    { enrolledCourses: courseId },
    {
      $pull: { enrolledCourses: courseId },
    }
  );

  return res.status(200).json(new apiResponse(200, deletedCourse, "Course deleted successfully"));
});

const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user?._id;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new apiError(404, "Course not found");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (user.enrolledCourses.some((id) => id.toString() === courseId)) {
    throw new apiError(409, "You are already enrolled in this course");
  }

  user.enrolledCourses.push(course._id);
  await user.save({ validateBeforeSave: false });

  course.enrolledStudents.push(user._id);
  await course.save({ validateBeforeSave: false });

  return res.status(200).json(new apiResponse(200, null, "Enrolled successfully"));
});

const getEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id)
    .select("enrolledCourses")
    .populate("enrolledCourses");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, user.enrolledCourses, "Enrolled courses fetched successfully"));
});

export {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
};
