import { User } from "../models/user.model.js";
import { apiError } from "./apiError.js";

const parseHostname = (value) => {
  if (!value) return null;

  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return new URL(value).hostname;
    }

    return new URL(`http://${value}`).hostname;
  } catch {
    return null;
  }
};

const shouldUseCrossSiteCookies = (req) => {
  if (!req) {
    return process.env.NODE_ENV === "production";
  }

  const origin = req.get("origin");
  const originHostname = parseHostname(origin);

  if (!originHostname) {
    return process.env.NODE_ENV === "production";
  }

  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = forwardedHost || req.get("host");
  const requestHostname = parseHostname(requestHost);

  if (!requestHostname) {
    return process.env.NODE_ENV === "production";
  }

  return originHostname !== requestHostname;
};

export const getCookieOptions = (req) => {
  const useCrossSiteCookies = shouldUseCrossSiteCookies(req);

  return {
    httpOnly: true,
    secure: useCrossSiteCookies,
    sameSite: useCrossSiteCookies ? "none" : "lax",
  };
};

export const setAuthCookies = (req, res, accessToken, refreshToken) => {
  const options = getCookieOptions(req);

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);
};

export const clearAuthCookies = (req, res) => {
  const options = getCookieOptions(req);

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
