const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const Login = require('./../Models/loginSchema')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.post('/', urlencodedParser, (req, res) => {
    var emailInput = req.body.email;
    var usernameInput = req.body.username;
    var passwordInput = req.body.password;
    var confirmPasswordInput = req.body.passwordConfirm;
  
    var roleInput = req.body.role;
    console.log("Selected role: " + roleInput);
  
    Login.find({"username" : usernameInput})
    .then((result) => {
      //Various tests for account standards when registering
      if(result.length > 0) {
        console.log("Username already exists");
        return res.render("registration", { alertShow: "show", message: "Username already exists!" });
       }else if(passwordInput != confirmPasswordInput){
        console.log("Passwords did not match");
        return res.render("registration", { alertShow: "show", message: "Passwords do not match!" });
       }else if(usernameInput.indexOf(' ') >= 0 || passwordInput.indexOf(' ') >= 0){
        console.log("Whitespace in username or password");
        return res.render("registration", { alertShow: "show", message: "No whitespaces are allowed!" });
       }else if(usernameInput == "" || passwordInput == "" || usernameInput == undefined || passwordInput == undefined){
        console.log("Username or password is empty");
        return res.render("registration", { alertShow: "show", message: "One or more fields are empty!" });
       }else if(usernameInput == passwordInput){
        console.log("Username and Password can not be the same value!");
        return res.render("registration", { alertShow: "show", message: "Username and Password can not be the same value!" });
       }else{
  
         //Account information looks good.
         //Hash the password, save account information to the database
         var hash = bcrypt.hashSync(passwordInput, 12);
  
         const login = new Login({
           email: emailInput,
           username: usernameInput,
           password: hash,
           role: roleInput
         });
  
         login.save()
           .then((result) => {
            //res.send(result);
            console.log("Successfully handled registration of a new user:");
            console.log(result);
            console.log("");
           })
           .catch((err) => {
             console.log(err);
           })
           return res.render('registrationSuccess');
       }
     }).catch((err) => {console.log(err);})
});

  module.exports = router;