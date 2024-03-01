const express=require('express');

const app=express();
const db=require('./db.js')
const cors=require('cors');
const bodyParser=require('body-parser');

app.use(cors());
require("dotenv/config.js")
app.use(bodyParser.json())

const userRouter=require('./Routes/userRoutes.js');

app.use('/user',userRouter);

app.listen(3000,()=>{
console.log("Server is Listening At Port 3000")
})