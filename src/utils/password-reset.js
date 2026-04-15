import crypto from "crypto";

export function generatePasswordesetToken(){
    return crypto.randomBytes(32).toString("hex");
}

export function hashPasswordResetToken(token){
    return crypto.createHash("sha256").update(token).digest("hex");
}