import * as authService from "../services/auth.service.js"

export async function register(req, res){
    console.log("hello from constroller");
    console.log(req.body);
    const result = await authService.register(req.body);
    if(!result.ok) {
        return res.status(result.status).json({error: result.error});
    }
    return res.status(201).json(result.data)
}

export async function login(req, res){
    const result = await authService.login(req.body);

    if (!result.ok){
        return res.status(result.status).json({error: result.error});
    }

    return res.status(200).json(result.data);
}