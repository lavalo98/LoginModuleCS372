const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
    if(req.session.loggedIn) {
      req.session.loggedIn = false; // set loggedIn to false
      return res.redirect("/"); // take the user back to the login screen
    }
    else {
      return res.redirect("/home"); // the user will be redirected again with a warning message
    }
})

module.exports = router;