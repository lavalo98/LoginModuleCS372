const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    if(!req.session.role == 1) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not a content editor!"});
    }
  
    return res.render("AddMovies", {alertShow: ""});
});

module.exports = router