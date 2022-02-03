const express = require('express');
var bodyParser = require('body-parser')
const app = express();
  
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var hardUsername = "admin";
var hardPassword = "password";
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/LoginPage.html');
});
    
app.post('/', urlencodedParser, (req, res) => {

  var usernameInput = req.body.username;
  var passwordInput = req.body.password;

  console.log('Username: ', usernameInput);
  console.log('Password: ', passwordInput);

  console.log('Username: ', hardUsername);
  console.log('Password: ', hardPassword);
    
  if(usernameInput == hardUsername && passwordInput == hardPassword){
    res.sendFile(__dirname + '/Success.html');
  }else{
    res.sendFile(__dirname + '/Failure.html');
  }
});
    
app.listen(80);
