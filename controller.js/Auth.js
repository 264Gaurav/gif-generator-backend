const  bcrypt=require('bcrypt');
const cors=require('cors');

//import model to interact with DB
const User=require("../model/User");
const jwt=require('jsonwebtoken');

require('dotenv').config();

//signup route handler
exports.signup=async(req,res)=>{
    try{
        //get data
        const{firstname,lastname,email,password}=req.body;
        console.log(req.body);
        //check if user already exist
        const existUser=await User.findOne({email:email}); // DB interaction 

        if(existUser){
            return res.status(400).json({
                    success:false ,
                    message:'User Already exists',
                });
        }
        //else the user is a new user 
        //secure password 
        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }
        catch(err){
            res.status(500).json({
                status:false,
                message:'Error while Password Encryption',
            })
        }

        //create  new entry i.e., signup User 
        const user=await User.create({    //DB interaction 
            firstname,lastname,email,password:hashedPassword     //create entry with updated password 
        })

        console.log("user=", user);
        return res.status(200).json({
            status:true,
            message:'User created successfully',
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered , please try again later.'
        });
    }
}



//Login route handler
exports.login=async(req,res)=>{
   try{
    const{email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Fill all fields correctly ",
        });
    }
    //check if user exist 
    let user=await User.findOne({email});
    if(!user){
        console.log('user is not registered.');
        return res.status(401).json({
            success:false,
            message:"User is not reistered.please signup first.",
        });
    }

    //verify user password and create a jwt token 
    const payload={
        email:user.email,
        id:user._id,
    };

    if(await bcrypt.compare(password,user.password) ){      //bcrypt.compare(hashedPassword , password)
        //password matched so.. create and store JWT token
        let token=jwt.sign(payload,
            process.env.JWT_SECRET,
            {expiresIn:'24h'}
        );

        console.log(user);
        //insert token in the user data 
        user=user.toObject();
        user.token=token;
        console.log(user);
        user.password=undefined;  //do not send password as to avoid hacking 
        console.log(user);
        //create cookie and send in response 
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),    //expires in 3 days since login
            httpOnly:true,     //can't be accessed at client side
        }
        res.cookie("GauravCookie",token,options).status(200).json({
            success:true,
            token,
            user,
            message:'User Logged in successfully..',
        });

    }
    else{  //password didn't matched 
        console.log('incorrect password.');
        return res.status(403).json({
            success:false,
            message:"Incorrect password.",
        });
    }
    
   }
   catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"server error , can,t Login .",
    });
   }

}