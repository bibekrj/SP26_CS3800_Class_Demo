import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { signAccessToken } from "../utils/jwt.js"; 
import { where } from "sequelize";
import { generatePasswordesetToken, hashPasswordResetToken } from "../utils/password-reset.js";
import { Op } from "sequelize";

const SALT_ROUNDS = 10;

const RESET_TOKEN_TTL_MINUTES = 15;

export async function register({name, email, password}){

        const normalizeEmail =  email.toLowerCase();
        // console.log(normalizeEmail, "Normalizaed email is")

        const existing = await User.findOne({where: {user_email: normalizeEmail}});
        // console.log("This line is after existing")
        if (existing){
            console.log("cannot check for EXISTING ++++++++++++++++++++")
            return {ok: false, status: 409, error:"Email already registered"};
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            user_name: name, 
            user_email: normalizeEmail,
            user_password: passwordHash,
            user_role: "user"
        });

        const token = signAccessToken( {sub: String(user.user_id),  email: user.user_email})

        return {ok: true, data:{token, user:{id: user.user_id, name: user.user_name, role: user.user_role}}}

}

export async function login({email, password}){
    const normalizeEmail = email.toLowerCase();

    const user = await User.findOne({where: {user_email: normalizeEmail}});

    if(!(user)){
        return {ok: false, status: 401, error:"Invalid credentials"};
    }



    const match = await bcrypt.compare(password, user.user_password);
   
    if(!match){
        return {ok: false, status: 401, error:"Invalid credential"};
    }

    const token = signAccessToken({sub: String(user.user_id), email: user.user_email});
    return {ok: true, data: {token, user:{id:user.user_id, name: user.user_name, email: user.user_email, role: user.user_role}}};
}


export async function forgotPassword({email}){
    const normalizeEmail = email.toLowerCase();

    const user = await User.findOne({where: {user_email: normalizeEmail}});

    if (!user){
        return {
            ok: true,
            data:{
                message: "If an account with that email exists, a reset link has been generated"
            },
        };
    }

    const rawToken = generatePasswordesetToken();
    const hashedToken = hashPasswordResetToken(rawToken);

    const expiresAt = new Date( Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    user.passwordResetTokenHash = hashedToken;
    user.passwordResetExpiresAt = expiresAt;
    
    console.log("The token is ", rawToken);
    await user.save();
    // this is where you'd send that email
    return {
        ok: true,
        data:{
            message:"If an account with that email exists, a reset link has been generated",
            resetToken: rawToken, 
            expiresAt,
        }
    }
}

export async function resetPassword({token, newPassword}){
    const hashedToken = hashPasswordResetToken(token);

    const user = await User.findOne({
        where:{
            passwordResetTokenHash: hashedToken,
            passwordResetExpiresAt: {
                [Op.gt]: new Date(),
            },
        },
    });

    if (!user){
        return{ ok: false, status:400, error:"Invalid or expires reset token"}
    }

    user.user_password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;

    await user.save();
    

    return{
        ok:true,
        data:{
            message: "password has been succesfully reset",
        }
    }


}