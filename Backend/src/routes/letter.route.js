import { Router } from "express";
import { saveLetter } from "../controllers/letter.controller.js";
const router = Router();
router.route("/hello").get((req, res) => {
  res.send("Hi");
});
router.route("/approve").patch();
router.route("/reject").patch();
router.route("/download").get();
router.route("/save/:type").post(saveLetter);
router.route("/sendMail").post();

export default router;
