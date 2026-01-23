let nextId = 3;

const todos =[
    {id:1, task:"Tryr to have fun with express",done:false},
    {id:2, task:"Buy eggs", done: false}
]


export function listTodos(req, res){
    res.json({count: todos.length, todos});
}


export function createTodos(req, res){
    const {task} = req.body;

    if(!task || typeof task !=="string" || task.trim()===""){
        return res.status(400).json({error:"task is required. You should provide non-empty string"});
    }

    const todo ={id: nextId++, task:task.trim(), done: false};
    todos.push(todo);

res.status(201).json({message:"Created", todo});

}