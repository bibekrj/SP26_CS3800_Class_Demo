import express from 'express';
import todoRoutes from "./routes/todo.routes.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";

// initializing app
const app = express();
const PORT = 3000;


//built-in middleware
app.use(express.json());

// custom middleware
app.use(logger);

app.get('/', (req, res) =>{
    res.send("Are you having fun yet?")
});

app.use("/api/todos", todoRoutes);

// not found
app.use((req, res) => {
    res.status(404).json({error:"Not found", path: req.originalUrl})
});

app.use(errorHandler);


app.listen(PORT, () =>console.log(`https://localhost:${PORT}`))




