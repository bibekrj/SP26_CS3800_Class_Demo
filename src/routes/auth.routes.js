import { Router } from "express";
import { validateBody } from "../middleware/validate.middleware.js";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateBody(["name", "email", "password"]), authController.register);
router.post("/adminRegister", validateBody(["name", "email", "password", "role"]), authController.register);
router.post("/login", validateBody(["email", "password"]), authController.login);

export default router;