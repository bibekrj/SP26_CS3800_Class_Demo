import { User, Todo } from "../models/index.js";

export async function getAllTodosService(){
    return await Todo.findAll( {order: [["id", "ASC"]]});
}

export async function getAllUserService(){
    return await User.findAll({
            attributes:["user_id", "user_name", "user_email", "user_role",]
        })
}
