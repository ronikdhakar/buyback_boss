const express=require('express')
const app=express()
const PORT=5000
const mongoose=require('mongoose')
const {MONGOURI}=require('./keys.js')

//password: GSE4gYnWGS9IqtjQ



mongoose.connect(MONGOURI,{useNewUrlParser: true,useUnifiedTopology: true})
mongoose.connection.on('connected',function(){
    console.log('connected to mongoose')
})

mongoose.connection.on('error',function(err){
    console.log('not connected to mongoose',err)
})


require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth.js'))
app.use(require('./routes/post.js'))


app.listen(PORT,function(){
    console.log('server is running ',PORT)
})