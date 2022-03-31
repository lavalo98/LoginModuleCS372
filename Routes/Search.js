const express = require('express');
const router = express.Router()

const Movie = require('./../Models/movieSchema')
const escapeRegex = require('./../public/Javascript/escapeSearchRegex')
const shuffleArray = require('./../public/Javascript/shuffleArray')

router.get('/', (req, res) =>{

    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    var search_query = req.query.search;
    var userRole = req.session.role;
    var movieNameArray = new Array();
    var movieImageArray = new Array();
    var releaseYearArray = new Array();
    var username = req.session.username;
  
    if(search_query){
      var movieNameArray = new Array();
      var movieImageArray = new Array();
      var releaseYearArray = new Array();
      var username = req.session.username;
      const regex = new RegExp(escapeRegex(search_query), 'gi');
  
      // Checks to see if any movie matches the regex request
      Movie.find({"movieName" : regex})
        .then((result) => {
          result = shuffleArray(result);
          result.forEach((movieName) => {
            movieNameArray.push(movieName.movieName);
          })
          result.forEach((movieName) => {
            movieImageArray.push(movieName.movieImageName);
          })
          result.forEach((movieName) => {
            releaseYearArray.push(movieName.releaseYear);
          })
          return res.render("search", {movieNameArray, movieImageArray, releaseYearArray, username, search_query, amtOfResults : result.length, userRole});
      }).catch((err) => {console.log(err);})
    }else{
      return res.render("search", {movieNameArray, movieImageArray, releaseYearArray, username, search_query, amtOfResults : 0});
    }
})

module.exports = router