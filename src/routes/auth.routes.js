import { Router } from "express";
import { validateBody } from "../middleware/validate.middleware.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateBody(["name", "email", "password"]), authController.register);
// router.post("/adminRegister", validateBody(["name", "email", "password", "role"]), authController.register);
// this needs to be done later //TODO
router.post("/login", validateBody(["email", "password"]), authController.login);

router.post("/forgot-password", validateBody(["email"]), authController.forgotPassword);
router.post("/reset-password", validateBody(["token", "newPassword"]), authController.resetPassword);

export default router;