//create server
const express=require('express');
const app=express();
const cors=require('cors');
//import route 
const user=require('./routes/user');

//config file extraction 
require('dotenv').config();
const PORT=process.env.PORT || 3000;

//middleware
app.use(express.json());

app.use(
    cors({
      origin: "*",
    })
);

//mount
app.use("/api/v1" , user); 



//start server
app.listen(PORT,()=>{
    console.log(`Server is Running at port: ${PORT} `);
})

//DB connect 
const db=require("./config/database");
db.connect();

//default route
app.get("/" , (req,res)=>{
    res.send(`<h2>This is Login and Authentication app.</h2> `)
})


