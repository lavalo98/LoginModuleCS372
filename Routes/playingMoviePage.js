const express = require('express')
const router = express.Router()

const Movie = require('./../Models/movieSchema')

router.get('/', (req, res) => {

    // Handle recent movie view count lock out
    var dateTime = new Date();
    var dateTimePlus24 = new Date(new Date().getTime()+(1000*60*60*24)); // 24 Hours past current time
  
    if(!req.session.movieSeenCount) {
      req.session.movieSeenCount = 0;
    }
  
    // Handle resets
    if(!req.session.moviePeriodEnd) {
      req.session.moviePeriodEnd = dateTimePlus24;
    }
    else if(dateTime > req.session.moviePeriodEnd) {
      req.session.moviePeriodEnd = dateTimePlus24;
      req.session.movieSeenCount = 0;
    }
  
    // Increment if user is below the limit, otherwise kick the user back to home
    if(req.session.movieSeenCount < 3) {
      req.session.movieSeenCount++;
    }
    else {
      //deny access
      return res.redirect("/home");
    }
  
    var movieName = decodeURI(req._parsedUrl.query);
  
    Movie.findOneAndUpdate({'movieName' : movieName}, {$inc : {'viewCount' : 1}}, {upsert: true}, function(err, doc) {
      if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
    });
  
    Movie.find({"movieName" : movieName})
    .then((result) => {
      return res.render("videoView", {movieName, movieImage : result[0].movieImageName});})
    .catch((err) => {console.log(err);})
});

module.exports = router