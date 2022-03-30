const express = require('express');
const router = express.Router()

const Movie = require('./../Models/movieSchema')
const shuffleArray = require('./../public/Javascript/shuffleArray')

router.get('/', (req, res) => {
  if(!req.session.loggedIn || req.session.loggedIn == false) {
    return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
  }

  var category_query = decodeURI(req._parsedUrl.query);
  var userRole = req.session.role;
  var username = req.session.username;

  Movie.find({"category" : category_query})
  .then((result) => {
    console.log(result);
    result = shuffleArray(result);

      return res.render("categoryType", {movieList : result, username, category_query, userRole});
  }).catch((err) => {console.log(err);})
});

module.exports = router