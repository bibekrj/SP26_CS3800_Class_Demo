import { User, Todo } from "../models/index.js";

export async function getAllTodosService(){
    return await Todo.findAll( {order: [["task_id", "ASC"]]});
}