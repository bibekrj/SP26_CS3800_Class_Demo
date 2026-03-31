import jwt from "jsonwebtoken";

export function signAccessToken(payload){
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not set");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
}


export function verifyAccessToken(token){
    if(!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET is not set");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
}