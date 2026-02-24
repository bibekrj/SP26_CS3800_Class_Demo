import dotenv from "dotenv";
dotenv.config();

function requireEnv(name){
    const value = process.env[name];
    if(!value){
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(requireEnv("PORT")),
    DB_HOST: requireEnv("DB_HOST"),
    DB_USER: requireEnv("DB_USER"),
    DB_PASSWORD: process.env.DB_PASSWORD ?? "password", // optional, defaults to empty
    DB_NAME: requireEnv("DB_NAME"),
    DB_PORT: Number(process.env.DB_PORT ?? "3306"),
};
