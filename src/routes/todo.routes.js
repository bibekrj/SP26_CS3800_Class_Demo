import { Router } from "express";

import {listTodos, createTodos, toggleTodo, removeTodo } from "../controllers/todo.controllers.js";


const router = Router();

router.get("/", listTodos);
router.post("/", createTodos);
router.patch("/:id/toggle", toggleTodo);
router.delete("/delete/:id", removeTodo);

export default router;