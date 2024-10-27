import { Router } from "express";
import {
  saveLetter,
  getHistory,
  sendEmail,
  approval,
} from "../controllers/letter.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/approve/:id").patch(approval);
router.route("/save/:type").post(verifyJWT, saveLetter);
router.route("/sendMail").post(verifyJWT, sendEmail);
router.route("/getHistory").get(verifyJWT, getHistory);

export default router;
