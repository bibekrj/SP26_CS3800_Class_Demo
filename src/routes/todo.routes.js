import { Router } from "express";

import {listTodos, createUserTodos, toggleTodo, removeTodo } from "../controllers/todo.controllers.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTodos);
router.post("/", createUserTodos);
router.patch("/:id/toggle", toggleTodo);
router.delete("/delete/:id", removeTodo);

export default router;