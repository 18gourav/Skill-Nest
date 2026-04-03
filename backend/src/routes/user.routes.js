import { Router } from "express";
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

const router = Router();

router.route("/register").post(userlogin);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, passwordChange);
router.route("/current-user").get(verifyJWT, getUser);
router.route("/dashboard").get(verifyJWT, getUserDashboard);

export default router;
