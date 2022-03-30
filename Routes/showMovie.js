const express = require('express');
const router = express.Router()

const Movie = require('./../Models/movieSchema')
const Login = require('./../Models/loginSchema')

router.get('/', (req, res) => {

    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    var userRole = req.session.role;
    var movie_query = decodeURI(req._parsedUrl.query);
    var username = req.session.username;
    var movieLikeStatus = "neutral";
    var userReview;
  
  
    Login.find({"username" : username})
    .then((result) => {
      //console.log(result);
  
      // Checks all users for their like status' of the current movie to send the movie page
      result[0].movieOpinion.forEach(function(movieOpinion){
        if(movieOpinion.movieName == movie_query){
          movieLikeStatus = movieOpinion.likedStatus;
        }
      });
  
      Movie.find({"movieName" : movie_query})
      .then((result2) => {
      //console.log(result2);
      //console.log("Before: " + result2[0].movieViewerReview);
  
      // Iterates through all of the movie reviews and splices out the current users review and adds it to a variable if it exists
      for (let i = 0; i < result2[0].movieViewerReview.length; i++) {
        if(result2[0].movieViewerReview[i].user == username){
          userReview = result2[0].movieViewerReview[i];
          result2[0].movieViewerReview.splice(i, 1);
        }
      }
  
      //console.log("After: " + result2[0].movieViewerReview);
  
      return res.render("moviePage", {
        movieName : result2[0].movieName,
        releaseYear : result2[0].releaseYear,
        description : result2[0].description,
        movieImageName : result2[0].movieImageName,
        rating : result2[0].rating,
        runtime : result2[0].runtime,
        category : result2[0].category,
        username : username,
        movieLikeStatus,
        movieReviewArray : result2[0].movieViewerReview,
        userReview,
        userRole,
      });
    }).catch((err) => {console.log(err);})}).catch((err) => {console.log(err);})
});

module.exports = router