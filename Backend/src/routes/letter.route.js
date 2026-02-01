import { Router } from "express";
import {
  saveLetter,
  getHistory,
  sendEmail,
  approval,
  showLetter,
} from "../controllers/letter.controller.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route (for verification)
router.route("/view/:id").get(showLetter);

// Student Routes
router.route("/save/:type").post(verifyJWT, verifyRole(["student"]), saveLetter);
router.route("/sendMail").post(verifyJWT, verifyRole(["student"]), sendEmail);
router.route("/getHistory").get(verifyJWT, verifyRole(["student"]), getHistory);

// Faculty Routes
router.route("/approve/:id").post(verifyJWT, verifyRole(["faculty"]), approval);
router.route("/pending").get(verifyJWT, verifyRole(["faculty"]), getPendingRequests);

export default router;
