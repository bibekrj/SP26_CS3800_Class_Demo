import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";        

const Todo = sequelize.define(
    "Todo",
    {
       task_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tasks: { 
            type: DataTypes.STRING(255),
            allowNull:false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            default: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName:"tasks",
        timestamps:true,
    }
);

export default Todo;