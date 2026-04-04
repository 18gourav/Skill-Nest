import { apiClient } from "./client";

export const listCourses = async () => {
  const response = await apiClient.get("/courses");
  return response.data;
};

export const listAdminCoursesOverview = async () => {
  const response = await apiClient.get("/courses/admin/overview");
  return response.data;
};

export const getCourseById = async (courseId) => {
  const response = await apiClient.get(`/courses/${courseId}`);
  return response.data;
};

export const enrollInCourse = async (courseId) => {
  const response = await apiClient.post(`/courses/enroll/${courseId}`);
  return response.data;
};

export const getMyEnrolledCourses = async () => {
  const response = await apiClient.get("/courses/my/enrolled");
  return response.data;
};

export const createCourse = async (payload) => {
  const response = await apiClient.post("/courses", payload);
  return response.data;
};

export const updateCourse = async (courseId, payload) => {
  const response = await apiClient.patch(`/courses/${courseId}`, payload);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await apiClient.delete(`/courses/${courseId}`);
  return response.data;
};
