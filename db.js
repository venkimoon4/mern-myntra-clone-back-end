const mongoose=require('mongoose');
require("dotenv/config.js")



// const mongoDBURLocal="mongodb://127.0.0.1:27017/myntra"

mongoose.connect(process.env.MongoDBAtlas);

const db=mongoose.connection;

db.on("connected",()=>{
  console.log("Connected To MongoDb Server")
})

db.on('error',()=>{
  console.log("Error in Connecting MongoDB Server")
})

db.on("disconnected",()=>{
  console.log('MongoDb Server Disconnected')
})

module.exports=db;