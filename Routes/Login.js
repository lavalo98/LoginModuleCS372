const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');

const Login = require('./../Models/loginSchema')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// Called when the Submit button is clicked
router.post('/', urlencodedParser, (req, res) => {

    var usernameInput = req.body.username; // User inputted username
    var passwordInput = req.body.password; // User inputted password

    var dateTime = new Date();
    var dateTimePlus24 = new Date(new Date().getTime()+(1000*60*60)); // 1 Hour past current date

    Login.find({"username" : usernameInput})
      .then((result) => {

        console.log('Handling login attempt of user ' + usernameInput);

        console.log('Response on querying database for user ' + usernameInput);
        console.log('');
        console.log(result);

        //Should only get one response back
        if(result.length == 1) {
          var user = result[0];
          console.log('');
          console.log(passwordInput);
          console.log(user.password);

          if(dateTime >= user.expirationDate) {
            //Compare hashed password after checking for account locked
            //as a small optimization to prevent repeated attempts on a locked account
            //from slowing down the server since hashing may be slow
            var success = bcrypt.compareSync(passwordInput, user.password);
            console.log(success);

            if(success) {
                Login.findOneAndUpdate({'username' : user.username}, {'failedLoginAttempts' : 0}, {upsert: true}, function(err, doc) {
                    if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
                });

                // Set some user data in cookie (for easier access)
                req.session.loggedIn = true;
                req.session.username = user.username;
                req.session.email = user.email;
                req.session.role = user.role;

                // Copy Paste from above, for now...

                return res.redirect('/home');

            }else {
              if(user.failedLoginAttempts >= 4){
                Login.findOneAndUpdate({'username' : user.username}, {'expirationDate' : dateTimePlus24, 'failedLoginAttempts' : 0}, {upsert: true}, function(err, doc) {
                  if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
                });
              }
              Login.findOneAndUpdate({'username' : user.username}, {'lastFailedLoginTime' : dateTime, $inc : {'failedLoginAttempts' : 1}}, {upsert: true}, function(err, doc) {
                if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
              });
              console.log("Username and/or password combination do not match database");
              return res.render("login", {alertShow: "show", header: "Login Failed!", message: "Username and password combination does not match any in database"});
            }
          }else{
            return res.render("login", {alertShow: "show", header: "Account LOCKED", message: "You have exceeded 5 attempts, account locked for 1 hour!"});
          }
        }else{
          console.log("Username and/or password combination do not match database");
          return res.render("login", {alertShow: "show", header: "Login Failed!", message: "Username and password combination does not match any in database"});
        }
      })
      .catch((err) => {
        console.log(err);
      })
  });

router.get('/', (req, res) => {

  loadUserSession(req, res, handleGetLogin);

});

function handleGetLogin(req, res, loaded) {
  if( !loaded ) {
    return res.render("login", {alertShow: "show", header: "Internal Error", message: "Could not load or regenerate session!"});
  }
  if(req.session.loggedIn) {
    return res.redirect("/home");
  }
  var tempUsername = "";
  if(req.session.username) {
    tempUsername = req.session.username;
  }
  return res.render("login", {alertShow: "", username: tempUsername});
};


// req: request from GET or POST method
function loadUserSession(req, res, callback) {
  req.session.reload(function(err) {
    var loaded = false;
    if(err) {
      console.log("Could not load session of user!");
      console.log(err);
      generateUserSession(req, res, loaded, callback);
    }
    else {
      loaded = true;
      callback(req, res, loaded);
    }
  })
};

function generateUserSession(req, res, loaded, callback) {
  req.session.regenerate(function(err) {
    if(err) {
      console.log("Could not generate a new session for user!");
      console.log(err);
      callback(req, res, loaded);
    }
    else {
      req.session.save(function(err) {
        loaded = true;
        callback(req, res, loaded);
      });
    }
  });
};

  module.exports = router;
