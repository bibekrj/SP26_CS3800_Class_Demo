let nextId = 3;

let todos =[
    {id:1, task:"Tryr to have fun with express",done:false},
    {id:2, task:"Buy eggs", done: false}
]

function getAllTodos(){
    return todos;
}

function createTodo(task){
    //   if(!task || typeof task !=="string" || task.trim()===""){
    //     // return res.status(400).json({error:"task is required. You should provide non-empty string"});
    //     throw new error("Invalid task")
    // }

    const todo ={id: nextId++, task:task.trim(), done: false};
    todos.push(todo);

    return todo;
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
    getAllTodos, 
    createTodo, 
    toggleTodoById, 
    deleteTodoById
};