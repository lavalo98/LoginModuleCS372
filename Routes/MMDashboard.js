const express = require('express');
const router = express.Router()

const Movie = require('./../Models/movieSchema')

router.get('/', (req, res) => {

    var username = req.session.username;
    var userRole = req.session.role;
    var movieMostViewed;
    var movieMostLiked;
    var movieMostDisliked;
  
    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    if(req.session.role != 2) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not a marketing manager!"});
    }
  
    Movie.find({})
    .then((movieList) => {
      movieMostViewed = movieList[0];
      movieMostLiked = movieList[0];
      movieMostDisliked = movieList[0];
      movieList.forEach((movie) =>{
        if(movie.likes > movieMostLiked.likes){
          movieMostLiked = movie;
        }
        if(movie.dislikes > movieMostDisliked.dislikes){
          movieMostDisliked = movie;
        }
        if(movie.viewCount > movieMostViewed.viewCount){
          movieMostViewed = movie;
        }
      })
  
      return res.render("MMDashboard", {username, userRole, movieList, movieMostViewed, movieMostLiked, movieMostDisliked});
    })
    .catch((err) => {
      console.log(err);
    })
})

module.exports = router