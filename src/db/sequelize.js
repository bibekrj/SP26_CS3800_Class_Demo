
import dotenv from "dotenv";
import { Sequelize } from "sequelize";  
dotenv.config();


const sequelize= new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_TYPE || "mysql",
        logging:false,
    }
);

export default sequelize;
