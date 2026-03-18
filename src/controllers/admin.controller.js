import { User, Todo } from "../models/index.js";
import * as adminTodoService from "../services/admin.service.js"

export async function listAllTodos(req, res, next){
    try{
        const todos = await adminTodoService.getAllTodosService();
        return res.status(200).json({todos});
    }
    catch(error){
        next(error);
    }
}


export async function listAllUsers(req,res,next){
    try{
        const users = await  User.findAll({
            attributes:["user_id", "user_name", "user_email", "user_role",]
        })
        return res.status(200).json({users});
    }
    catch(error){
        next(error);
    }
}