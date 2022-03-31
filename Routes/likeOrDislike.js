const express = require('express');
const router = express.Router()

const Movie = require('./../Models/movieSchema')
const Login = require('./../Models/loginSchema')

router.post('/', (req, res) => {

    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    var username = req.session.username;
    var movieName = req.body.movieName;
    var likedOrDisliked = req.body.likedOrDisliked;
    var toDoLike = req.body.toDoLike;
    var movieExists = false; // If movie previously has a like or dislike entry in DB
  
    if(toDoLike == 'addLike'){
      Movie.findOneAndUpdate({'movieName' : movieName}, {$inc : {'likes' : 1}}, {upsert: true}, function(err, doc) {
        if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
      });
    }else if(toDoLike == 'addDislike'){
      Movie.findOneAndUpdate({'movieName' : movieName}, {$inc : {'dislikes' : 1}}, {upsert: true}, function(err, doc) {
        if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
      });
    }else if(toDoLike == 'subLike'){
      Movie.findOneAndUpdate({'movieName' : movieName}, {$inc : {'likes' : -1}}, {upsert: true}, function(err, doc) {
        if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
      });
    }else if(toDoLike == 'subDislike'){
      Movie.findOneAndUpdate({'movieName' : movieName}, {$inc : {'dislikes' : -1}}, {upsert: true}, function(err, doc) {
        if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
      });
    }else if(toDoLike == 'subLikeAddDislike'){
      Movie.findOneAndUpdate({'movieName' : movieName}, {$inc : {'dislikes' : 1 , 'likes' : -1}}, {upsert: true}, function(err, doc) {
        if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
      });
    }else if(toDoLike == 'addLikeSubDislike'){
      Movie.findOneAndUpdate({'movieName' : movieName}, {$inc : {'likes' : 1, 'dislikes' : -1}}, {upsert: true}, function(err, doc) {
        if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
      });
    }
  
    // Find user to check their likes and dislikes
    Login.find({"username" : username})
    .then((result) => {
      //console.log(result);
  
      // Cycle through all likes and dislikes and checks if there is already a like or dislike entry in the DB
      result[0].movieOpinion.forEach(function(movieOpinion){
        if(movieOpinion.movieName == movieName){
          movieExists = true;
          movieOpinion.likedStatus = likedOrDisliked;
          const userData = new Login(result[0]);
          userData.save().then((newResult) => {
          }).catch((err) => {
            console.log(err);
          })
        }
      });
      // If no movie likeStatus in DB create one
      if(!movieExists){
        Login.findOneAndUpdate({'username' : username}, {$push : {"movieOpinion" : {movieName: movieName, likedStatus: likedOrDisliked}}}, {upsert: true}, function(err, doc) {
          if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
        });
      }
    }).catch((err) => {console.log(err);})
  
});

module.exports = router
  