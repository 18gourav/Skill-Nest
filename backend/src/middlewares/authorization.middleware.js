import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import  {User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req , res , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token) {
        throw new apiError(401, 'You are not authorized to access this resource');
    }

    const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
     const user = await User.findById(decodedToken._id).select('-password -refreshToken')

    if(!user) {
        throw new apiError(401, 'You are not a valid user');
    }

    req.user = user;
    next();
    } catch (error) {
        throw new apiError(401, error?.message || 'access denied, invalid token') 
    }

})

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    if (req.user?.role !== "admin") {
        throw new apiError(403, "Admin access required");
    }

    next();
});