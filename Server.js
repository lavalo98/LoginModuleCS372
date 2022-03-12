//Libraries
const fs = require('fs');
const readline = require('readline');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
var bodyParser = require('body-parser');

//Database Information
const Login = require('./Models/loginSchema');
const { db } = require('./Models/loginSchema');
const { Console } = require('console');

//Web Server
const app = express();

const movieList = ["Black Panther", "Once Upon a Time…in Hollywood", "The Tribe", "Personal Shopper", 
                   "Black Coal, Thin Ice", "Call Me By Your Name", "Amour", "Batman", "Superman", 
                   "Avengers", "Dragon Ball Z", "Dragonball Super", "Dragon Ball", "Dragon Ball GT", 
                   "First Reformed", "Zama", "Transformers"];

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Sets up use for .css files
app.use(express.static(path.join(__dirname, 'public')));

dbURI = "";

console.log("Attempting to get DB URI from mongodb.uri...");

try {
    dbURI = fs.readFileSync('mongodb.uri', 'utf8');
    console.log(dbURI);
} catch(e) {
    console.log('Error:', e.stack);
    //Default to our MongoDB Atlas instance
    dbURI = 'mongodb+srv://darian:7w4YCd9sZaDCTv2x@cluster0.jmx1t.mongodb.net/LoginDB';
}

//MongoDB URI
//Not usually safe to include in the source BUT using this only works
//if your IP is whitelisted (since we're using atlas) so it's fine for now
//const dbURI = 'mongodb+srv://darian:7w4YCd9sZaDCTv2x@cluster0.jmx1t.mongodb.net/LoginDB';

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

var urlencodedParser = bodyParser.urlencoded({ extended: false });



app.get('/', (req, res) => {
  res.render("login", {alertShow: ""})
  //res.sendFile(__dirname + '/LoginPage.html');
});

app.get('/testing', (req, res) => {
  res.render("Test", {movieList});
});

app.post('/register', (req, res) => {
  res.render("registration", {alertShow: ""})
  //res.sendFile(__dirname + '/RegisterPage.html');
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
      console.log("Username already exists");
      res.render("registration", { alertShow: "show", message: "Username already exists!" });
     }else if(passwordInput != confirmPasswordInput){
      console.log("Passwords did not match");
      res.render("registration", { alertShow: "show", message: "Passwords do not match!" });
     }else if(usernameInput.indexOf(' ') >= 0 || passwordInput.indexOf(' ') >= 0){
      console.log("Whitespace in username or password");
      res.render("registration", { alertShow: "show", message: "No whitespaces are allowed!" });
     }else if(usernameInput == "" || passwordInput == "" || usernameInput == undefined || passwordInput == undefined){
      console.log("Username or password is empty");
      res.render("registration", { alertShow: "show", message: "One or more fields are empty!" });
     }else if(usernameInput == passwordInput){
      console.log("Username and Password can not be the same value!");
      res.render("registration", { alertShow: "show", message: "Username and Password can not be the same value!" });
     }else{

       var hash = bcrypt.hashSync(passwordInput, 12);

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
        console.log(user.lastLoginTime);
        /*Login.updateOne({username : usernameInput}, update, (err, res) => {
          console.log(res);
        })*/
        var success = bcrypt.compareSync(passwordInput, user.password);
        console.log(success);
        if(success) { 
          res.render("Home", { username: usernameInput});
        }
      }else {
        console.log("Username and/or password combination do not match database");
        res.render("login", {alertShow: "show"})
      }
    })
    .catch((err) => {
      console.log(err);
    })
});
