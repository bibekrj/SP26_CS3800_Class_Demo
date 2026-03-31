import express from 'express';
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import adminRoutes from "./routes/admin.routes.js"
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";
import cors from "cors";

export function createApp(){
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoutes );
    app.use("/api/todos", todoRoutes);
    app.use("/api/admin", adminRoutes);

    app.use(logger);
    app.use(errorHandler);

    return app
}