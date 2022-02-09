//Libraries
const fs = require('fs');
const readline = require('readline');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

//Database Information
const Login = require('./Models/loginSchema');
const { db } = require('./Models/loginSchema');

//Web Server
const app = express();

//MongoDB URI
//Not usually safe to include in the source BUT using this only works
//if your IP is whitelisted (since we're using atlas) so it's fine for now
const dbURI = 'mongodb+srv://darian:7w4YCd9sZaDCTv2x@cluster0.jmx1t.mongodb.net/LoginDB';

//Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(80))
  .catch(err => console.log(err));

//A page that lists all user data in the database
app.get('/all-users', (req, res) => {
  Login.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    })
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/LoginPage.html');
});

app.post('/register', (req, res) => {
  res.sendFile(__dirname + '/RegisterPage.html');
});

app.post('/login', (req, res) => {
  res.sendFile(__dirname + '/LoginPage.html');
});

app.post('/registration-confirmation', urlencodedParser, (req, res) => {
  var usernameInput = req.body.username;
  var passwordInput = req.body.password;
  var confirmPasswordInput = req.body.passwordConfirm;

  Login.find({"username" : usernameInput})
  .then((result) => {
    if(result.length > 0){
       res.sendFile(__dirname + '/RegistrationFailed.html');
       console.log("Username already exists");
     }else if(passwordInput != confirmPasswordInput){
       res.sendFile(__dirname + '/RegistrationFailed.html');
       console.log("Passwords did not match");
     }else if(usernameInput.indexOf(' ') >= 0 || passwordInput.indexOf(' ') >= 0){
      res.sendFile(__dirname + '/RegistrationFailed.html');
      console.log("Whitespace in username or password");
     }else if(usernameInput == "" || passwordInput == "" || usernameInput == undefined || passwordInput == undefined){
      res.sendFile(__dirname + '/RegistrationFailed.html');
      console.log("Username or password is empty");
     }else{

       var hash = bcrypt.hashSync('passwordInput', 12);

       const login = new Login({
         username: usernameInput,
         password: hash
       });

       login.save()
         .then((result) => {
           res.send(result);
         })
         .catch((err) => {
           console.log(err);
         })
       res.sendFile(__dirname + '/RegistrationSuccess.html');
     }
     console.log(result);
   })
   .catch((err) => {
     console.log(err);
   })
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/LoginPage.html');
});

// Called when the Submit button is clicked
app.post('/', urlencodedParser, (req, res) => {

  var usernameInput = req.body.username; // User inputted username
  var passwordInput = req.body.password; // User inputted password


  Login.find({"username" : usernameInput})
    .then((result) => {

      console.log('Response on querying database for user ' + usernameInput);
      console.log('');
      console.log(result);

      //Should only get one response back
      if(result.length == 1) {
        var user = result[0];
        console.log('');
        console.log(passwordInput);
        console.log(user.password);
        var success = bcrypt.compareSync(passwordInput, user.password);
        console.log(success);
        if(success) {
          res.sendFile(__dirname + '/Success.html');
        }
        else {
          res.sendFile(__dirname + '/Failure.html');
        }
      } else {
        res.sendFile(__dirname + '/Failure.html');
      }
    })
    .catch((err) => {
      console.log(err);
    })

  //WAS used for flat-file authentication
  /*
  for (let i = 0; i < listOfUsernames.length; i++) {
    if(usernameInput == listOfUsernames[i] && passwordInput == listOfPasswords[i]){
      res.sendFile(__dirname + '/Success.html');
      return;
    }
  }

  res.sendFile(__dirname + '/Failure.html');
  */

});
