const mongoose=require('mongoose');
const {Schema}=mongoose;

const userSchema= new Schema({
    firstname:{
        type:String,
        require:true,
        trim:true,
    },
    lastname:{
        type:String,
       
    },
    email:{
        type:String,
        require:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    } 
})

module.exports=mongoose.model("User",userSchema);