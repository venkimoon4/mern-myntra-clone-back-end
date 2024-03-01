const mongoose=require('mongoose');

const cartSchema=mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
  },
  image:{
    type:String,
    required:true
  },
  company:{
    type:String,
    required:true
  },
  item_name:{
    type:String,
    required:true
  },
  original_price:{
    type:Number,
    required:true
  },
  current_price:{
    type:Number,
    required:true
  },
  discount_percentage:{
    type:Number,
    required:true
  },
  return_period:{
    type:Number,
    required:true
  },
  delivery_date:{
    type:String,
    required:true
  },
  rating:{
    stars:{
      type:Number,
      required:true
    },
    count:{
      type:Number,
      required:true
    }
  },
  quantity:{
    type:Number,
    required:true
  }
})

const Cart=mongoose.model("Cart",cartSchema);

module.exports=Cart;