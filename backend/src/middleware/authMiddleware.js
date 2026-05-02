import jwt from 'jsonwebtoken'

export const protect = (req,res,next)=>{
    let token;
    if(req.headers.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
        console.log("No token to authorize")
        return res.status(401).json({message:"Not authorized"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();

    }catch(err){
        console.log("Token failed check it agian")
       res.status(401).json({message:"Token failed"});
    }
}