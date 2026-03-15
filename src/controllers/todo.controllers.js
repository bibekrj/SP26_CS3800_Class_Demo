// import { getTodosService, createTodoService,toggleTodoByIdService,deleteTodoByIdService } from "../services/todo.service.js";

import {getUserTodosService, createUserTodoService, toggleTodoByIdService, deleteTodoByIdService} from "../services/todo.service.js";

export async function listTodos(req, res){
    const todos = await getUserTodosService(req.user.id);
    res.json({count: todos.length, todos});
}


export async function createUserTodos(req, res){
    try{
        console.log(req.body)
        // console.log(req.user.id)
        console.log(req.user.user_id)
        
        const {task} = req.body;
        const todo = await createUserTodoService(req.user.user_id, task);
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
