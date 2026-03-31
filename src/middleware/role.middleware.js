export function requireRole(...allowedRoles){
    return (req, res, next) =>{
        if(!req.user){
            return res.status(401).json({
                message:"Unauthorized",
            });
        }
        if (!allowedRoles.includes(req.user.user_role)){
            return res.status(403).json({
                message:"Forbidden: insufficient permissions",
            });
        }
         next();
    };
   
}