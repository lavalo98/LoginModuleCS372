const express = require('express');
const router = express.Router()

const Movie = require('./../Models/movieSchema')

router.post('/', (req, res) => {

    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    var starAmount = req.body.rate;
    var reviewText = req.body.reviewText;
    var movieName = req.body.movieName;
    var recommends;
    var username = req.session.username;
    var dateTime = new Date();
  
    if(req.body.recommendBox == 'Recommends'){
      recommends = true;
    }else{
      recommends = false;
    }
  
    // Adds in the user's review into the database
    Movie.findOneAndUpdate({'movieName' : movieName}, {$push : {"movieViewerReview" : {user: username, amtOfStars: starAmount, reviewText: reviewText, dateOfReview: dateTime, recommend : recommends}}}, {upsert: true}, function(err, doc) {
      if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
    });
  
    // Goes back once back to the moviePage after sending the post request
    res.redirect('back');
});

module.exports = router