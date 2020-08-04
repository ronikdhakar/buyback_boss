const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')
const mongoose=require('mongoose')
const User=mongoose.model('User')

module.exports=function(req,res,next){
    const {authorization}=req.headers
    if (!authorization){
        res.send('you must be logged in')
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,function(err,payload){
        if (err){
            return res.send('you must be logged in')

        }
        const {_id}=payload
        User.findById(_id).then(function(userdata){
            req.user=userdata
            next()
        })
        
    })
}