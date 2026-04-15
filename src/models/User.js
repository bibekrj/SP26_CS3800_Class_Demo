import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";  

const User = sequelize.define(
    "User",
    {
        user_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        user_name:{
            type: DataTypes.STRING(255),
            allowNull:true
        },
        user_email:{
            type: DataTypes.STRING(255),
            allowNull:false,
            unique: true
        },
        user_password:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        user_role:{
            type: DataTypes.ENUM("admin", "staff", "user"),
            allowNull: false,
            default:"user"
        },
        passwordResetTokenHash:{
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        passwordResetExpiresAt:{
            type: DataTypes.DATE,
            allowNull: true
        }

    },
    {
        tableName: "users",
        timestamps: true,
        indexes: [{unique:true, fields:["user_email"]}]
    }
);

export default User;