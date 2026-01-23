import { Router } from "express";

import {listTodos, createTodos, toggleTodo } from "../controllers/todo.controllers.js";


const router = Router();

router.get("/", listTodos);
router.post("/", createTodos);
router.patch("/:id/toggle", toggleTodo);

export default router;