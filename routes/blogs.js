const express = require("express");
const router = express.Router();
const Blogs = require("../models/blogs");
const multer = require("multer");
const path = require("path");
const Comment = require('../models/comment')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve("./public/uploads");
    console.log(`Uploading to: ${uploadPath}`);
    return cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const newFilename = Date.now() + path.extname(file.originalname);
    console.log(`Saving file as: ${newFilename}`);
    return cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

router.post("/add-new", upload.single("coverImage"), async (req, res) => {
  const { title, description , coverImage} = req.body;
  const blog = new Blogs({
    title,
    description,
    coverImage,
    createdBy: req.user._id,
  });
  await blog.save();
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  const blog = await Blogs.findById(req.params.id).populate("createdBy");
  const comment = await Comment.find({blogId : req.params.id}).populate('createdBy')
  res.render("blog", {
    blog,
    user: req.user,
    comment
  });
});


router.post('/comments/:blogId' , async(req,res)=>{
  const {comment} = req.body

  console.log(comment , 'Comment');
  

  const commentCreate  = await Comment.create({
    comment , 
    createdBy : req.user._id,
    blogId : req.params.blogId
  })

  res.redirect(`/blog/${req.params.blogId}`)

 
})



module.exports = router;
