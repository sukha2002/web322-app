/**********************************************************************
* WEB322 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy.
* No part of this assignment has been copied manually or electronically from any other
source
* (including web sites) or distributed to other students.
*
* Name: Sukhmandeep Singh Kahlon Student ID: 155832207 Date: 04-02-2022
*
* Online (Heroku) URL: https://thawing-hamlet-18999.herokuapp.com/about
************************************************************************
********/ 
const express = require("express");
var path = require("path");
const posts = require("./data/posts.json");
const blogService = require('./blog-service.js');
const categories = require("./data/categories.json");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.redirect("/about");
});


app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/blog", function(req,res){
    blogService.getPublishedPosts().then((result) => {
      res.send(result);
    }).catch((err) => {
      return err;
    });
});

app.get("/posts", function(req,res){
    blogService.getAllPosts().then((result) => {
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

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

blogService.initialize().then(() => {
  app.listen(HTTP_PORT);
})
.catch((err) => {
  console.log(err);
});