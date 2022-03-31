const express = require('express')
const router = express.Router()

const Movie = require('./../Models/movieSchema')

router.post('/', (req, res) => {

    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    var commentText = req.body.commentText;
    var movieName = req.body.movieName;
    var username = req.session.username;
  
    // Adds in the user's review into the database
    Movie.findOneAndUpdate({'movieName' : movieName}, {$push : {"movieViewerComment" : {user: username, commentText: commentText}}}, {upsert: true}, function(err, doc) {
      if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
    });
  
    // Goes back once back to the moviePage after sending the post request
    res.redirect('back');
});

module.exports = router