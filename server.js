/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part
* Of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sukhmandeep Singh Kahlon Student ID: 155832207 Date: 18-02-2022
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/
const express = require("express");
var path = require("path");
const posts = require("./data/posts.json");
const blogService = require('./blog-service.js');
const categories = require("./data/categories.json");
const app = express();
const multer = require("multer")
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: 'dos8fvnk4',
  api_key: '242752834521126',
  api_secret: 'jPRo6pmznygCgC0qWBms5DiQ_XQ',
  secure: true
});

const upload = multer();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.redirect("/about");
});


app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/posts/add", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addPost.html"));
});

app.get("/blog", function(req,res){
    blogService.getPublishedPosts().then((result) => {
      res.send(result);
    }).catch((err) => {
      return err;
    });
});

app.get("/posts", function(req,res){
  if(req.query.category) {
    blogService.getPostsByCategory(req.query.category).then((result) => {
      res.send(result);
    }).catch((err) => {
      return err;
    });
  }
  else if(req.query.minDate) {
    blogService.getPostsByMinDate(req.query.minDate).then((result) => {
      res.send(result);
    }).catch((err) => {
      return err;
    });
  }
  else {
    blogService.getAllPosts().then((result) => {
      res.send(result);
    }).catch((err) => {
      return err;
    });
  }
});

app.get("/posts/:id", function(req,res){
  blogService.getPostById(req.params.id).then((result) => {
  res.send(result);
}).catch((err) => {
  return err;
});
});

app.get("/categories", function(req,res){
    blogService.getCategories().then((result) => {
    res.send(result);
  }).catch((err) => {
    return err;
  });
});

app.post('/posts/add', upload.single('featureImage'), function (req, res, next) {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
    (error, result) => {
    if (result) {
    resolve(result)
    } else {
    reject(error)
    }}
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
   };
   async function upload(req) {
    let result = await streamUpload(req);
    console.log(result)
    return result
   }
   upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url
    const formData = req.body;
    blogService.addPost(formData);
    res.redirect("/posts");   
  });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

blogService.initialize().then(() => {
  app.listen(HTTP_PORT);
})
.catch((err) => {
  console.log(err);
});