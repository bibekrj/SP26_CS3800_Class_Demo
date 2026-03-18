import {Router} from "express";
import * as adminController from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";


const router = Router();

router.use(requireAuth);
router.use(requireRole("admin"));


router.get("/todos", adminController.listAllTodos);
router.get("/users", adminController.listAllUsers);

export default router;