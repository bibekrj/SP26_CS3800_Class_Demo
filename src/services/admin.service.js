import { User, Todo } from "../models/index.js";

export async function getAllTodosService(){
    return await Todo.findAll( {order: [["task_id", "ASC"]]});
}

export async function getAllUserService(){
    return await User.findAll({
            attributes:["user_id", "user_name", "user_email", "user_role",]
        })
}


// export async function createUserTodoAdminService(user){
//      if(!task || typeof task !=="string" || task.trim()===""){
//         // return res.status(400).json({error:"task is required. You should provide non-empty string"});
//         throw new Error("Invalid task")
//     }
// }