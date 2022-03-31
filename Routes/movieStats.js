const express = require('express')
const router = express.Router()

const Movie = require('./../Models/movieSchema')

router.get('/', (req, res) => {
    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    if(req.session.role != 2) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not a marketing manager!"});
    }
  
    var userRole = req.session.role;
    var movie_query = decodeURI(req._parsedUrl.query);
    var username = req.session.username;
  
    Movie.find({'movieName' : movie_query})
    .then((result) => {
  
      movieInfo = result[0];
  
      return res.render("movieStats", {
        movieInfo,
        username,
        userRole
      });
    }).catch((err) => {console.log(err);})
})

module.exports = router
  