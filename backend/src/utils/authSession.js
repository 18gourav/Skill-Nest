import { User } from "../models/user.model.js";
import { apiError } from "./apiError.js";

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const options = getCookieOptions();

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);
};

export const clearAuthCookies = (res) => {
  const options = getCookieOptions();

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options);
};

export const generateAuthTokens = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new apiError(404, "User not found");
  }

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken, user };
};
