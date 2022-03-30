const express = require('express')
const router = express.Router()

const Movie = require('./../Models/movieSchema')
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', urlencodedParser, (req, res) => {

    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    if(req.session.role != 1) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not a content editor!"});
    }
  
    var movieName = req.body.movieName;
    var releaseYear = req.body.releaseYear;
    var description = req.body.description;
    var movieImageName = req.body.movieImageName;
    var movieFileName = req.body.movieFileName;
    var rating = req.body.rating;
    var runtime = req.body.runtime;
    var category = req.body.category;
  
    const movie = new Movie({
      movieName: movieName,
      releaseYear: releaseYear,
      description: description,
      movieImageName: movieImageName,
      movieFileName: movieFileName,
      rating: rating,
      runtime: runtime,
      category: category
    });
  
    movie.save()
        .then((result) => {
          console.log("Movie JSON data:");
          console.log("");
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        })
  
    return res.render("AddMovies", {alertShow: ""});
  
});

module.exports = router
  