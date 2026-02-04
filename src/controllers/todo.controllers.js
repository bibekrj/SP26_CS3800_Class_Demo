import { getAllTodos, createTodo,toggleTodoById,deleteTodoById } from "../services/todo.service.js";


export function listTodos(req, res){
    const todos = getAllTodos();
    res.json({count: todos.length, todos});
}


export function createTodos(req, res){
    try{
        const {task} = req.body;
        const todo = createTodo(task);
        res.status(201).json({message:"Created", todo});
    } catch(err){
        res.status(400).json({error:err.message});
    } 
}

export function toggleTodo(req, res){
    const id = Number(req.params.id);
    const todo = toggleTodoById(id);

    if(!todo){
        return res.status(400).json({error : "Todo not found"});
    }
    res.json({message:"Toggled", todo});

}


export function removeTodo(req, res){
    const id = Number(req.params.id);
    const todo = deleteTodoById(id);

    if(!todo){
        return res.status(400).json({error: "Todo not found"})
    }

    res.json({message:"Deleted Successfully"})
}
