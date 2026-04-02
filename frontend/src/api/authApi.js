import { apiClient } from "./client";

export const registerUser = async (payload) => {
  const response = await apiClient.post("/users/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await apiClient.post("/users/login", payload);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/users/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/users/current-user");
  return response.data;
};

export const getDashboard = async () => {
  const response = await apiClient.get("/users/dashboard");
  return response.data;
};
