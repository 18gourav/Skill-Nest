import { Router } from "express";
import passport from "passport";
import {
  userlogin,
  loginUser,
  logoutUser,
  refreshAccessToken,
  passwordChange,
  getUser,
  getUserDashboard,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authorization.middleware.js";
import { frontendURL, isGoogleAuthEnabled } from "../config/passport.js";
import { generateAuthTokens, setAuthCookies } from "../utils/authSession.js";

const router = Router();

const localOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

const getFrontendBaseFromRequest = (req) => {
  const origin = req.get("origin");

  if (origin && localOriginPattern.test(origin)) {
    return origin;
  }

  const referer = req.get("referer");

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;

      if (localOriginPattern.test(refererOrigin)) {
        return refererOrigin;
      }
    } catch {
      // Ignore invalid referer and fall back to configured CLIENT_URL.
    }
  }

  return frontendURL;
};

const encodeOAuthState = (redirectBase) => Buffer.from(JSON.stringify({ redirectBase }), "utf8").toString("base64url");

const decodeOAuthState = (state) => {
  if (!state) return null;

  try {
    const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
    const redirectBase = parsed?.redirectBase;
    return redirectBase && localOriginPattern.test(redirectBase) ? redirectBase : null;
  } catch {
    return null;
  }
};

router.route("/register").post(userlogin);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

router.get("/google", (req, res, next) => {
  if (!isGoogleAuthEnabled()) {
    return res.redirect(`${frontendURL}/login?oauth=missing`);
  }

  const redirectBase = getFrontendBaseFromRequest(req);
  const state = encodeOAuthState(redirectBase);

  return passport.authenticate("google", {
    scope: ["openid", "profile", "email"],
    state,
    session: false,
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  const redirectBase = decodeOAuthState(req.query.state) || frontendURL;

  if (!isGoogleAuthEnabled()) {
    return res.redirect(`${redirectBase}/login?oauth=missing`);
  }

  return passport.authenticate("google", { session: false }, async (error, user) => {
    if (error || !user) {
      return res.redirect(`${redirectBase}/login?oauth=error`);
    }

    const { accessToken, refreshToken } = await generateAuthTokens(user._id);
    return setAuthCookies(req, res, accessToken, refreshToken).redirect(`${redirectBase}/dashboard?oauth=success`);
  })(req, res, next);
});

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, passwordChange);
router.route("/current-user").get(verifyJWT, getUser);
router.route("/dashboard").get(verifyJWT, getUserDashboard);

export default router;
