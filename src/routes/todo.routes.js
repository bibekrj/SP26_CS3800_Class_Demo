import { Router } from "express";

// import {listTodos, createUserTodos, toggleTodo, removeTodo } from "../controllers/todo.controllers.js";

import * as todoController from "../controllers/todo.controllers.js";

import { validateBody } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js"

const router = Router();

router.use(requireAuth);

// router.use(requireRole("admin", "staff", "users"));


router.get("/", todoController.listTodos);
router.post("/", todoController.createTodo);
router.patch("/:id/toggle", todoController.toggleTodo);
router.delete("/delete/:id", todoController.removeTodo);

export default router;