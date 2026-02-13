// import { getTodosService, createTodoService,toggleTodoByIdService,deleteTodoByIdService } from "../services/todo.service.js";

import {getTodosService, createTodoService, toggleTodoByIdService, deleteTodoByIdService} from "../services/todo.service.js";

export async function listTodos(req, res){
    const todos = await getTodosService();
    res.json({count: todos.length, todos});
}


export async function createTodos(req, res){
    try{
        const {task} = req.body;
        const todo = await createTodoService(task);
        res.status(201).json({message:"Created", todo});
    } catch(err){
        res.status(400).json({error:err.message});
    } 
}

export function toggleTodo(req, res){
    const id = Number(req.params.id);
    const todo = toggleTodoByIdService(id);

    if(!todo){
        return res.status(400).json({error : "Todo not found"});
    }
    res.json({message:"Toggled", todo});

}


export function removeTodo(req, res){
    const id = Number(req.params.id);
    const todo = deleteTodoByIdService(id);

    if(!todo){
        return res.status(400).json({error: "Todo not found"})
    }

    res.json({message:"Deleted Successfully"})
}
