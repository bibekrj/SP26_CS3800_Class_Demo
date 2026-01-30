import dotenv from "dotenv";

dotenv.config();


function requireEnv(name){
    const value = process.env[name];
    if(!value){
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env ={
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(requireEnv("PORT")),
};

