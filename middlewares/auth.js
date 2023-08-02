//auth     isStudent     isAdmin

const jwt=require('jsonwebtoken');  //to extract role from token
require('dotenv').config();

exports.auth=(req,res,next)=>{
    try{
        //extract jwt token
       // const token= req.cookies.token;
        const token=req.body.token ;
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        //verify the token
        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
 
            req.user=payload;
        }catch(error){
            return res.status(401).json({
                success:false,
                message:'token is Invalid'
            })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Something Went wrong while verifying the token ',
        });
    }
}


