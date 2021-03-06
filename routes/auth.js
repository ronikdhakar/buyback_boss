const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=mongoose.model('User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys.js')
const requiredLogin=require('../middleware/requiredLogin')


router.get('/protected',requiredLogin,function(req,res){
    res.send('hello user')
})

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body 
    if(!email || !password || !name){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then(function(savedUser){
        if(savedUser){
          return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(function(hashedpassword){
              const user = new User({
                  email,
                  password:hashedpassword,
                  name
              })
      
              user.save()
              .then(function(user){
                  res.json({message:"saved successfully"})
                  
              })
              .catch(err=>{
                  console.log(err)
              })
        })
       
    })
    .catch(function(err){
      console.log(err)
    })
  })

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(function(savedUser){
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(function(doMatch){
            if(doMatch){
                 //res.json({message:"successfully signed in"})
                 const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                 res.send(token)
            
            }
            else{
                return res.status(422).json({error:"Invalid Email or password 2"})
            }
        })
        .catch(function(err){
            console.log(err)
        })
    })
})

module.exports=router