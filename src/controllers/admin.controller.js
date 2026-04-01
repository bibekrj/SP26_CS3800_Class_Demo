// import { User, Todo } from "../models/index.js"; //controllers must exclusively call on  Services and NOT models

import * as adminTodoService from "../services/admin.service.js"
import * as todoService from "../services/todo.service.js"

export async function listAllTodos(req, res, next){
    try{
        const todos = await adminTodoService.getAllTodosService();
        console.log(todos)
        return res.status(200).json({todos});
    }
    catch(error){
        next(error);
    }
}

export async function listAllUsers(req,res,next){
    try{
        const users = await  adminTodoService.getAllUserService();
        return res.status(200).json({users});
    }
    catch(error){
        next(error);
    }
}

export async function createTodo(req, res, next){
    try{
        const {task} = req.body;
        const todo = await todoService.createUserTodoService(1, task); //this will have to be updated to create TOdo tied to admin user
        res.status(201).json({message:"Created", todo});
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
}




// TODO reset userpassword
// TODO update user record