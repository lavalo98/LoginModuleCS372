function submitLogin(obj){
    if(validateForm()){
        document.getElementById('loginForm').action = '/'
        document.getElementById('loginForm').submit();
    }
}
    
function submitRegistration(obj){
    document.getElementById('loginForm').action = '/register'
    document.getElementById('loginForm').submit();
}

function togglePassword() {
    // toggle the type attribute
    var x = document.getElementById("passwordTextBox");

    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
    
function validateForm() {
    var usernameField = document.forms["loginForm"]["username"].value;
    var passwordField = document.forms["loginForm"]["password"].value;
    
    if (usernameField == "" || passwordField == "") {
        return false;
    }else{
        return true;
    }
}