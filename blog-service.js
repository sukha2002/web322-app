const posts = require("./data/posts.json");
const categories = require("./data/categories.json");
const fs = require("fs"); // required at the top of your module

let postsArray = [];
let categoriesArray = [];

const initialize = () => {
    return new Promise(function(resolve, reject){ // place our code inside a "Promise" function
        fs.readFile("./data/posts.json", 'utf8', (err, data) => {
            if (err) reject("unable to read file");
            postsArray = JSON.parse(data);
        });
        fs.readFile("./data/categories.json", 'utf8', (err, data) => {
            if (err) reject("unable to read file");
            categoriesArray = JSON.parse(data);
        });
        resolve("Success!");
    });   
}

const getAllPosts = () => {
    return new Promise(function(resolve, reject){
        if(postsArray.length == 0) {
            reject("no results returned");
        }
        resolve(postsArray);
    });   
}

const getPublishedPosts = () => {
    return new Promise(function(resolve, reject){
        if(postsArray.length == 0) {
            reject("no results returned");
        }
        let published = [];
        for(let i = 0; i < postsArray.length; i++) {
            if(postsArray[i].published == true) {
                published.push(postsArray[i]);
            }
        }
        resolve(published);
    });   
}

const getCategories = () => {
    return new Promise(function(resolve, reject){
        if(categoriesArray.length == 0) {
            reject("no results returned");
        }
        resolve(categoriesArray);
    });   
}

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories};