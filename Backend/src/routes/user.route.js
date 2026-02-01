import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  createAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateDetails,
  getAllUsers,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

router.route("/refresh-token").get(createAccessToken);

router.route("/get-user").get(verifyJWT, getCurrentUser);
router.route("/update-details").patch(verifyJWT, updateDetails);
// Admin Route
import { verifyRole } from "../middlewares/verifyRole.js";
router.route("/get-all-users").get(verifyJWT, verifyRole(["admin"]), getAllUsers);

export default router;
