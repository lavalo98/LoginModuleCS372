const express = require('express')
const router = express.Router()

const Movie = require('./../Models/movieSchema')
const shuffleArray = require('./../public/Javascript/shuffleArray')

router.get('/', (req, res) => {
  // If user is not logged in with a valid session cookie, reject them
  req.session.reload(function(err) {
    // session updated
    if(err) console.log("Could not load session of user!");
    else console.log(req.session.username);
  })

  console.log(req.session);
  if(!req.session.loggedIn || req.session.loggedIn == false) {
    return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
  }

  var recommendedMoviesArray = new Array();
  var userRole = req.session.role;
  var username = req.session.username;

  Movie.find({})
    .then((result) => {
      result = shuffleArray(result);
      // Get an array with all reccomended reviews
      result.forEach((movieName) => {
        movieName.movieViewerReview.every((review) => {
          if(review.recommend == true){
            recommendedMoviesArray.push(movieName);
            return false;
          }
          return true;
        })
      })
      // Shuffle the array up
      recommendedMoviesArray.forEach((movie) => {
        movie.movieViewerReview = shuffleArray(movie.movieViewerReview);
      })
      // Only choose 4
      if(recommendedMoviesArray.length >= 5){
        recommendedMoviesArray.splice(4);
      }
      return res.render("Home", {movieList : result, username, recommendedMoviesArray, userRole});
  }).catch((err) => {console.log(err);})
});

module.exports = router