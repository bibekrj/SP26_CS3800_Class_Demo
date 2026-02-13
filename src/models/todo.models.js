import pool from "../db/connection.js";

export async function getAllTodos(){
    const [rows] = await pool.query("SELECT * FROM todos;")
    console.log(rows);
    return rows;

}

let nextId = 3;

let todos =[
    {id:1, task:"Tryr to have fun with express",done:false},
    {id:2, task:"Buy eggs", done: false}
]

// function getAllTodos(){
//     return todos;
// }

export async function createTodo(task){
    //   if(!task || typeof task !=="string" || task.trim()===""){
    //     // return res.status(400).json({error:"task is required. You should provide non-empty string"});
    //     throw new error("Invalid task")
    // }

    // const todo ={id: nextId++, task:task.trim(), done: false};
    // todos.push(todo);

    // return todo;
    const [result] = await pool.query(
        "INSERT INTO todos(task) VALUES (?)", [task]
    );
    return {id: result.insertId, task, completed:false};

}

function toggleTodoById(id){
    const todo = todos.find(t => t.id === id);
    if(!todo){
        return null;
    }
    todo.done= !todo.done;
    return todo;
}

function deleteTodoById(id){
   const todoIndex = todos.findIndex(t => t.id === id);

    if(todoIndex === -1){
        return null;
    }

    return todos.splice(id, 1)[0];
}

export default {
     
     
    toggleTodoById, 
    deleteTodoById
};