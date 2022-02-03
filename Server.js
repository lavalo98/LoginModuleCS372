const fs = require('fs');
const readline = require('readline');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();

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

  for (let i = 0; i < listOfUsernames.length; i++) {
    if(usernameInput == listOfUsernames[i] && passwordInput == listOfPasswords[i]){
      res.sendFile(__dirname + '/Success.html');
      return;
    }
  }

  res.sendFile(__dirname + '/Failure.html');

});

app.listen(80);
