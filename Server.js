const fs = require('fs');
const readline = require('readline');
const express = require('express');
const mongoose = require('mongoose');
const Login = require('./Models/loginSchema');
var bodyParser = require('body-parser');
const { db } = require('./Models/loginSchema');
const app = express();

// Connect to MongoDB
//const dbURI = 'mongodb+srv://LoginWebServer:1htbflrr4YPpbFog@cluster0.jmx1t.mongodb.net/LoginDB';
const dbURI = 'mongodb://172.17.0.7';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(80))
  .catch(err => console.log(err));

app.get('/add-user', (req, res) => {
  const login = new Login({
    username: 'admin',
    password: 'password'
  });

  login.save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    })
});

app.get('/all-users', (req, res) => {
  Login.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    })
});


const readInterface = readline.createInterface({
  input: fs.createReadStream('Logins.txt'),
  output: process.stdout,
  console: false
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var listOfUsernames = []; // Created a list of usernames
var listOfPasswords = []; // Created a list of passwords

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/LoginPage.html');
});

// Takes the Logins.txt file and puts the username and password into their respective arrays
readInterface.on('line', function(line) {
  var words = line.split(" ");
  listOfUsernames.push(words[0]);
  listOfPasswords.push(words[1]);
});

// Called when the Submit button is clicked
app.post('/', urlencodedParser, (req, res) => {

  var usernameInput = req.body.username; // User inputted username
  var passwordInput = req.body.password; // User inputted password

  Login.find({"username" : usernameInput, "password" : passwordInput})
    .then((result) => {
      if(result.length == 1){
        res.sendFile(__dirname + '/Success.html');
      }else{
        res.sendFile(__dirname + '/Failure.html');
      }
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    })

  /*for (let i = 0; i < listOfUsernames.length; i++) {
    if(usernameInput == listOfUsernames[i] && passwordInput == listOfPasswords[i]){
      res.sendFile(__dirname + '/Success.html');
      return;
    }
  }

  res.sendFile(__dirname + '/Failure.html');*/

});
