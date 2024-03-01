const express=require('express');
const User = require('../Models/userSchema.js');
const bcrypt=require('bcrypt')
const { generateToken, jwtAuthMiddleWare,} = require('../auth.js');

const router=express.Router();

router.post('/signup',async(req,res)=>{

  try{

    const {name,email,password,mobileno}=req.body;

    // const useremail=data.email;

    const findUser=await User.findOne({email:email});

    if(findUser){
      return res.status(400).json({error:"user with this email already exist"})
    }
    else{
       
      const salt=await bcrypt.genSalt();

      const hashedPassword=await bcrypt.hash(password,salt)

      const newUser=new User({name,email,password:hashedPassword,mobileno});
      const savedUser=await newUser.save();

      const userPayload={
        id:savedUser._id
      }

      const token=generateToken(userPayload);

      res.status(200).json({savedUser,email:savedUser.email,token:token})
    }

  }
  catch(error){
    res.status(500).json({error:error.message})
  }
  
})

router.post('/login',async(req,res)=>{

  try{

    const {email,password}=req.body;

    const findUser=await User.findOne({email:email});

    if(!findUser){
      return res.status(400).json({error:"invalid email"})
    }

    const isMatched=await bcrypt.compare(password,findUser.password)

    if(!isMatched){
     return res.status(400).json({error:"invalid password"})
    }

    const userPayload={
      id:findUser._id
    }

    const token=generateToken(userPayload);

    res.status(200).json({email:findUser.email,token:token})

  }

  catch(error){
    return res.status(500).json({error:error.message})
  }
})


//==============Cart Item Post Into User========================//

router.post('/cart',jwtAuthMiddleWare,async(req,res)=>{

  try{

    const {id}=req.user;

    const data=req.body;

    const company=data.company;

    const findUser= await User.findOne({_id:id});

    if(!findUser){
      return res.status(400).json({errro:"user not found"})
    }

    const existingItem=findUser.cart.find((item)=>item.company===company);

    console.log(JSON.stringify(existingItem));

    if(existingItem){
       existingItem.quantity++;
       findUser.markModified('cart'); 
       await findUser.save();
       res.status(200).json(findUser)
    }
    else{
      findUser.cart.push(data);
      await findUser.save();
      res.status(200).json(findUser)
    }


  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


//======================Get Cart Items OF The User=====================//

router.get('/cart', jwtAuthMiddleWare, async (req, res) => {
  try {
    const { id } = req.user;

    const findUser = await User.findOne({ _id: id });

    if (!findUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const cartItems = findUser.cart;

    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//===================Delete Cart Item of The User======================//

router.delete('/cart/:id',jwtAuthMiddleWare,async(req,res)=>{

  try{

  const {id}=req.user;

  const itemId=req.params.id;

  const findUser= await User.findOne({_id:id});

  if(!findUser){
    return res.status(400).json({error:"user not found"})
  }

  const index=findUser.cart.findIndex((item)=>item.id===itemId);

  const deleteCartItem= await findUser.cart.splice(index,1)

  await findUser.save();

  res.status(200).json(deleteCartItem)

}
catch(error){
  res.status(500).json({error:error.message})
}

})


//==========================Shippng Address============================//

router.post('/cart/shipping',jwtAuthMiddleWare,async(req,res)=>{
  try{
    const {id}=req.user;
    console.log(id)
    const {firstName,lastName,address,country,zipcode,city,state}=req.body;

    const findUser=await User.findById({_id:id});

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    findUser.shippingAddress={
     firstName:firstName || findUser.shippingAddress.firstName,
     lastName:lastName || findUser.shippingAddress.lastName,
     address:address || findUser.shippingAddress.address,
     country:country || findUser.shippingAddress.country,
     zipcode:zipcode || findUser.shippingAddress.zipcode,
     city:city || findUser.shippingAddress.city,
     state:state || findUser.shippingAddress.state
    }

    const savedAddress=await findUser.save();

    res.status(200).json(savedAddress.shippingAddress);

  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})



//===================User Payment Checkout=======================//

router.post('/cart/checkout',jwtAuthMiddleWare,async(req,res)=>{
  try{
    const {id}=req.user;
    console.log(id)
    const {price,nameOnCard,cardNumber}=req.body;

    const findUser=await User.findById({_id:id});

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    findUser.payment.push({
      price,
      nameOnCard,
      cardNumber,
    })

    const savedAddress=await findUser.save();

    res.status(200).json(savedAddress.payment);

  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

//===================Create  User MyOrders=====================//

router.post('/cart/payment',jwtAuthMiddleWare,async(req,res)=>{

  try{
    const id=req.user.id;

    const data=req.body;

    const findUser=await User.findOne({_id:id});

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }
     findUser.myOrders.push(...data);
     await findUser.save();
     res.status(200).json(findUser);
  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


//============================Get Payment==========================//

router.get('/cart/payment',jwtAuthMiddleWare,async(req,res)=>{

  try{

    const id=req.user.id;

    const findUser=await User.findOne({_id:id});

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }
    
    res.status(200).json(findUser.myOrders);
  }
  catch(error){
   res.status(500).json({error:message})
  }
})


//=====================Clear Cart Of User After CheckOut==================//

router.delete('/cart',jwtAuthMiddleWare,async(req,res)=>{

  try{

    const id=req.user.id;

    const findUser=await User.findById(id);

    if(!findUser){
      return res.status(400).json({error:"user not found"})
    }

    findUser.cart=[]
    await findUser.save();

    res.status(200).json({message:"all items deleted in cart"})

  }
  catch(error){
    res.status(500).json({error:error.message})
  }

})


module.exports=router