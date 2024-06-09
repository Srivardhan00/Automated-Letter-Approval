import { Router } from "express";

const router = Router();
router.route("/register").post();
router.route("/login").post();
router.route("/logout").post();
router.route("/history").get();
router.route("/updateDetails").post();
router.route("/updatePassword").post();

export default router;
