import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/index.js";


export async function requireAuth(req, res, next) {
    try{
        const header = req.headers.authorization || "";
        const [type, token] = header.split(" ");

        if (type !=="Bearer" || !token){
           return res.status(401).json({error: "Missing or invalid Authorization header"});
        }

        const decoded = verifyAccessToken(token);
        const userId = Number(decoded.sub);

        const user = await User.findByPk(userId, {attributes:["user_id", "user_name", "user_email"]});

        if (!user){
            return res.status(404).json({error:"User does not exist"});
        }

        req.user = user;
        next();
    }
    catch(err){
        return res.status(401).json({error:"Invalid Token"})
    }
}