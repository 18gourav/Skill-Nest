import asyncHandler from "./../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { clearAuthCookies, generateAuthTokens, setAuthCookies } from "../utils/authSession.js";

// Registration API
const userlogin = asyncHandler(async (req, res) => {
   const { emailId, password, fullName, username } = req.body;

   if ([emailId, password, fullName, username].some((field) => !field || field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
   }

   if (password.length < 6) {
      throw new apiError(400, "Password must be at least 6 characters");
   }

   const existedUser = await User.findOne({
      $or: [{ emailId }, { username }],
   });

   if (existedUser) {
      throw new apiError(409, "Username or email already exists");
   }

   const users = await User.create({
      emailId,
      password,
      username,
      fullName,
      role: "user",
   });

   const createdUser = await User.findById(users._id).select("-password -refreshToken");

   return res.status(201).json(new apiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
   const { emailId, username, password } = req.body;

   if (!password || (!emailId && !username)) {
      throw new apiError(400, "Give emailId or username and password");
   }

   const findUser = await User.findOne({
      $or: [{ username }, { emailId }],
   });

   if (!findUser) {
      throw new apiError(404, "User not found");
   }

   const passwordMatch = await findUser.isPasswordCorrect(password);

   if (!passwordMatch) {
      throw new apiError(401, "Password is incorrect");
   }

   const { refreshToken, accessToken } = await generateAuthTokens(findUser._id);

   const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken");

   return setAuthCookies(res, accessToken, refreshToken)
      .status(200)
      .json(
         new apiResponse(
            200,
            {
               user: loggedInUser,
               accessToken,
               refreshToken,
            },
            "User logged in successfully"
         )
      );
});

const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: { refreshToken: undefined },
      },
      {
         new: true,
      }
   );

   return clearAuthCookies(res)
      .status(200)
      .json(new apiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;

   if (!incomingrefreshToken) {
      throw new apiError(401, "Refresh token is required");
   }

   const decodedToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET);
   const user = await User.findById(decodedToken._id);

   if (!user) {
      throw new apiError(401, "User not found");
   }

   if (incomingrefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Invalid refresh token");
   }

   const { accessToken, refreshToken } = await generateAuthTokens(user._id);

   return setAuthCookies(res, accessToken, refreshToken)
      .status(200)
      .json(
         new apiResponse(
            200,
            {
               accessToken,
               refreshToken,
            },
            "Access token refreshed successfully"
         )
      );
});

const passwordChange = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;

   if (!oldPassword || !newPassword) {
      throw new apiError(400, "Old password and new password are required");
   }

   if (newPassword.length < 6) {
      throw new apiError(400, "New password must be at least 6 characters");
   }

   const user = await User.findById(req.user?._id);

   if (!user) {
      throw new apiError(404, "User not found");
   }

   const passwordCorrect = await user.isPasswordCorrect(oldPassword);

   if (!passwordCorrect) {
      throw new apiError(400, "Old password is not correct");
   }

   user.password = newPassword;
   await user.save({ validateBeforeSave: false });

   return res.status(200).json(new apiResponse(200, null, "Password successfully changed"));
});

const getUser = asyncHandler(async (req, res) => {
   const currentUser = await User.findById(req.user?._id)
      .select("-password -refreshToken")
      .populate("enrolledCourses");

   return res.status(200).json(new apiResponse(200, currentUser, "User fetched successfully"));
});

const getUserDashboard = asyncHandler(async (req, res) => {
   const currentUser = await User.findById(req.user?._id)
      .select("username fullName emailId role enrolledCourses")
      .populate("enrolledCourses");

   if (!currentUser) {
      throw new apiError(404, "User not found");
   }

   return res.status(200).json(new apiResponse(200, currentUser, "Dashboard fetched successfully"));
});

export { userlogin, loginUser, logoutUser, refreshAccessToken, passwordChange, getUser, getUserDashboard };