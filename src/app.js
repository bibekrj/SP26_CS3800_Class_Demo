import express from 'express';
import todoRoutes from "./routes/todo.routes.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";


export function createApp(){
    const app = express();
    app.use(express.json());

    app.use("/api/todos", todoRoutes);

    app.use(logger);
    app.use(errorHandler);

    return app
}