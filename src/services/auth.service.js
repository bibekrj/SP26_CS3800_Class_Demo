import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { signAccessToken } from "../utils/jwt.js"; 
import { where } from "sequelize";

const SALT_ROUNDS = 10;

export async function register({name, email, password}){
        const normalizeEmail =  email.toLowerCase();

        const existing = await User.findOne({where: {user_email: normalizeEmail}});
        if (existing){
            return {ok: false, status: 409, error:"Email already registered"};
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            name, 
            user_email: normalizeEmail,
            passwordHash
        });

        const token = signAccessToken( {sub: String(user.user_id),  email: user.user_email})

        return {ok: true, data:{token, user:{id: user.user_id, name: user.user_name}}}

}

export async function login({email, password}){
    const normalizeEmail = email.toLowerCase();

    const user = await User.findOne({where: {user_email: normalizeEmail}});

    if(!(user)){
        return {ok: false, status: 401, error:"Invalid credentials"};
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match){
        return {ok: false, status: 401, error:"Invalid credential"};
    }

    const token = signAccessToken({sub: String(user.user_id), email: user.user_email});
    return {ok: true, data: {token, user:{id:user.user_id, name: user_name, email: user_email}}};
}