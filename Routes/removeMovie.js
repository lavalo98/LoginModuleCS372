const express = require('express');
const router = express.Router()

const Movie = require('./../Models/movieSchema')

router.post('/', (req, res) => {

    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    var movieName = req.body.movieName;
    var username = req.session.username;
  
    // Finds the users review for the movie and removes it from the database
    Movie.findOneAndUpdate({'movieName' : movieName}, {$pull : {"movieViewerReview": {user : username}}}, function(err, doc) {
      if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
    });
    // Reloads moviePage
    res.redirect('back');
});

module.exports = router