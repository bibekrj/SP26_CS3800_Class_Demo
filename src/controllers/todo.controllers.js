// import { getTodosService, createTodoService,toggleTodoByIdService,deleteTodoByIdService } from "../services/todo.service.js";

// import {getUserTodosService, createUserTodoService, toggleTodoByIdService, deleteTodoByIdService} from "../services/todo.service.js";

import { response } from "express";
import * as todoService from "../services/todo.service.js";

export async function listTodos(req, res, next) {
  try {
    const todos = await todoService.listTodos(req.user.user_id);
    console.log(todos);
    res.json({ count: todos.length, todos });
  } catch (err) {
    next(err);
  }
}

export async function createTodo(req, res, next) {
  try {
    const todo = await todoService.createUserTodoService(
      req.user.user_id,
      // 1,
      req.body.tasks,
    );
    return res.status(201).json({ todo });
  } catch (err) {
    next(err);
  }
}

export async function toggleTodo(req, res, next) {
  try {
    // console.log("trying to print req")
    // console.log(req.params)
    const result = await todoService.toggleTodo(
    req.user.user_id,
      Number(req.params.id),
    );
    console.log(result)
    if (!result.ok) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json({ todo: result.data });
  } catch (err) {
    next(err);
  }
}

export async function removeTodo(req, res, next) {
  try {
    const result = await todoService.removeTodo(
      req.user.user_id,
      Number(req.params.id),
    );
    if (!result.ok) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// export async function createUserTodos(req, res){
//     try{
//         console.log(req.body)
//         // console.log(req.user.id)
//         console.log(req.user.user_id)

//         const {task} = req.body;
//         const todo = await createUserTodoService(req.user.user_id, task);
//         res.status(201).json({message:"Created", todo});
//     } catch(err){
//         res.status(400).json({error:err.message});
//     }
// }

// export function toggleTodo(req, res){
//     const id = Number(req.params.id);
//     const todo = toggleTodoByIdService(id);

//     if(!todo){
//         return res.status(400).json({error : "Todo not found"});
//     }
//     res.json({message:"Toggled", todo});

// }

// export function removeTodo(req, res) {
//   const id = Number(req.params.id);
//   const todo = deleteTodoByIdService(id);

//   if (!todo) {
//     return res.status(400).json({ error: "Todo not found" });
//   }

//   res.json({ message: "Deleted Successfully" });
// }
