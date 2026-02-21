import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";        

const Todo = sequelize.define(
    "Todo",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        task: { 
            type: DataTypes.STRING(255),
            allowNull:false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            default: false,
        }
    },
    {
        tableName:"todos",
        timestamps:false,
    }
);

export default Todo;