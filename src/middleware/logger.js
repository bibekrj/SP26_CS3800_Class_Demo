export default function logger(req, res, next){
    const start = Date.now();

    res.on("finish",() =>{
        const diff = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${diff}ms) `)
    })
    next();
}