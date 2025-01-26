const express = require('express')
const path = require('path')
const app = express()
const User = require('./routes/user')
const Blogs = require('./routes/blogs')
const BlogModel =  require('./models/blogs')
const router = express.Router()
require('dotenv').config()
const mongoose = require('mongoose')
const cookieParser =  require('cookie-parser')
const {checkForAuthentication} = require('./middlewares/authentication')

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentication('token'))
app.use(express.static('public'))

mongoose.connect(process.env.MONGO_URL).then(()=>{
  console.log('Database Connected');
  
}).catch((err)=>{
  console.log(err);
})


app.set('view engine' , 'ejs')
app.set('views' , './views')

app.use('/user' , User)
app.use('/blog' , Blogs)

app.get('/' , async(req  , res)=>{
  const allBlogs= await BlogModel.find({})
  res.render('home', {
    user : req.user,
    allBlogs: allBlogs
  })
})

app.listen(process.env.PORT , ()=>{
    console.log(`Server Started`);
    
})