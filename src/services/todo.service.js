// WILL NEVER HAVE ANYTHING RELATING TO HTTP CALLS OR RESPONSES

import * as ToDoModel from "../models/todo.models.js"

export async function getUserTodosService(userId){
    return await Todo.findAll({ where: {userId}, order: [["id", "ASC"]]});
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

function toggleTodoByIdService(id){
    // const todo = todos.find(t => t.id === id);
    // if(!todo){
    //     return null;
    // }
    return ToDoModel.toggleTodoById(id);
}

function deleteTodoByIdService(id){
    return ToDoModel.deleteTodoById(id);
}


export {
    
    
    toggleTodoByIdService,
    deleteTodoByIdService

};


