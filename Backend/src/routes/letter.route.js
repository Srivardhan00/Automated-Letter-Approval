import { Router } from "express";

const router = Router();
router.route("/approve").patch();
router.route("/reject").patch();
router.route("/download").get();
router.route("/save").post();
router.route("/sendMail").post();

export default router;
