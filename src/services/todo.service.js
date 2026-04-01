// WILL NEVER HAVE ANYTHING RELATING TO HTTP CALLS OR RESPONSES

// import { where } from "sequelize";
import * as ToDoModel from "../models/todo.models.js"
import { Todo } from "../models/index.js";
import { getAllTodosService } from "./admin.service.js";

// export async function getUserTodosService(userId){

//     return await Todo.findAll({ where: {userId}, order: [["id", "ASC"]]});
// }

export async function listTodos(user){
    if(user.role === "admin"){
        return await Todo.findAll({ where: {user_id}, order: [["task_id", "ASC"]]});
    }

    return Todo.findAll({
        where: {user_id: user},
        order: [["createdAt", "ASC"]]
    })
}

export async function createUserTodoService(userId, task){
    console.log("got to service")
    if(!task || typeof task !=="string" || task.trim()===""){
        // return res.status(400).json({error:"task is required. You should provide non-empty string"});
        throw new Error("Invalid task")
    }
    console.log("completed service logic check")
    return await ToDoModel.createUserTodo(userId, task);
}

export async function toggleTodo(user, todoId){
    const todo = await Todo.findByPk(todoId);
    if(!todo){
        return{ok: false, status: 404, error: "Todo Not Found"};
    }


    todo.completed = !todo.completed;
    console.log(todo)

    await todo.save();

    return {ok: true, status: 200 }

} 


export async function removeTodo(user, todoId){
    const todo = await Todo.findByPk(todoId);
    if(!todo){
        return {ok: false, status: 404, error: "Todo not found"};
    }

    // if(user.role !== "admin" && todo.user){
    //  return {ok: false, status: 403, error: "Forbidden"};
    // }
    await todo.destroy();

    return {ok: true, status: 200}
}

// function deleteTodoByIdService(id){
//     return ToDoModel.deleteTodoById(id);
// }



