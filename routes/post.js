const express=require('express')
const mongoose=require('mongoose')
const router=express.Router()
const requiredLogin = require('../middleware/requiredLogin')
const Post=mongoose.model('Post')


router.get('/allpost',function(req,res){
    Post.find().populate('postedBy',"_id name")
    .then(function(posts){
        res.json({posts:posts})
    })
    .catch(function(err){
        if (err){
            console.log('error',err)
        }
    })
})

router.post('/createpost',requiredLogin,function(req,res){
    const {title,body}=req.body
    if (!title || !body){
        return res.send('please add all the fields')
    }
    req.user.password=undefined
    const post=new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save()
    .then(function(saved){
        if(!saved){
            res.send(saved)
        }
    })
    .catch(function(err){
        console.log(error)
    })

})

router.get('/mypost',requiredLogin,function(req,res){
    Post.find({postedBy:req.user._id})
    .populate("postedBy",'_id email name')
    .then(function(mypost){
        res.json({mypost})
    })
    .catch(function(err){
        console.log(err)
    })
})

module.exports=router