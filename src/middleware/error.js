export default function errorHandler(err, req, res, next){
    console.log("Error", err);
    res.status(500).json({error:"Internal Server Error"});
}