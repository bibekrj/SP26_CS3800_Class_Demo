// WILL NEVER HAVE ANYTHING RELATING TO HTTP CALLS OR RESPONSES

import * as ToDoModel from "../models/todo.models.js"

export async function getTodosService(){
    return await ToDoModel.getAllTodos();
}

export async function createTodoService(task){
    if(!task || typeof task !=="string" || task.trim()===""){
        // return res.status(400).json({error:"task is required. You should provide non-empty string"});
        throw new Error("Invalid task")
    }
    return await ToDoModel.createTodo(task);
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


