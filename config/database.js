const mongoose=require('mongoose');

require("dotenv").config();
const URL=process.env.DATABASE_URL;

exports.connect=()=>{
    mongoose.connect(URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
      }
    )
    .then(
        ()=>{ console.log("DB connected successfully.") }
    ).catch( (err)=>{
        console.log("DB connection issue");
        console.error(err);
        process.exit(1);
    } )
}