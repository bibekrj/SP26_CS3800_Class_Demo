// import { User, Todo } from "../models/index.js"; //controllers must exclusively call on  Services and NOT models

import * as adminTodoService from "../services/admin.service.js"

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



// TODO reset userpassword
// TODO update user record