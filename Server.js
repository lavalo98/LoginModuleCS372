// Libraries
const fs = require('fs');
const readline = require('readline');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session'); // Documentation: https://www.npmjs.com/package/express-session
const MongoStore = require('connect-mongo'); // Documentation: https://www.npmjs.com/package/connect-mongo

// Database Information
const Login = require('./Models/loginSchema');
const Movie = require('./Models/movieSchema');
const { db } = require('./Models/loginSchema');
const { Console } = require('console');
const text = require('body-parser/lib/types/text');

// Web Server
const app = express();

// Send headers so cookies work
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Set pug as view engine, "views" as location for .pug files
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Sets up use for .css files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

dbURI = "";

console.log("Attempting to get DB URI from mongodb.uri...");

//Set the URI of the database. If a mongodb.uri exists, load the URI from there.
//Otherwise, default to MongoDB Atlas instance
//Not usually safe to include in the source BUT using this only works
//if your IP is whitelisted (since we're using atlas)
try {
    dbURI = fs.readFileSync('mongodb.uri', 'utf8');
    console.log(dbURI);
} catch(e) {
    console.log('Error:', e.stack);
    //Default to our MongoDB Atlas instance
    dbURI = 'mongodb+srv://darian:7w4YCd9sZaDCTv2x@cluster0.jmx1t.mongodb.net/LoginDB';
}

//Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(80))
  .catch(err => console.log(err));

app.use(session({
  store: MongoStore.create({
    mongoUrl: dbURI,
    ttl: 24 * 60 * 60, // Set cookie expiration to 1 day
    stringify: false,
  }), // Create a MongoDB cookie store at the same dbURI
  secret: 'averyverysecretsecret', // Key for managing cookie data stored in MongoDB
  cookie: { secure: false, httpOnly: false, expires: new Date(Date.now() + 9999999), sameSite: 'lax' },
  resave: true,
  saveUninitialized: true,
}));

//A page that lists all user data in the database
app.get('/all-users', (req, res) => {
  Login.find()
    .then((result) => {
      return res.send(result);
    })
    .catch((err) => {
      console.log(err);
      return res.send(err);
    })
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Function to shuffle the array content
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {

      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }

  return array;
}

app.get('/', (req, res) => {
  return res.render("login", {alertShow: ""});
});

app.get('/search', (req, res) =>{
  var search_query = req.query.search;
  var movieNameArray = new Array();
  var movieImageArray = new Array();
  var releaseYearArray = new Array();
  var username = req.session.username;
  console.log("What you searched for: "+ search_query);

  if(search_query){
    var movieNameArray = new Array();
    var movieImageArray = new Array();
    var releaseYearArray = new Array();
    var username = req.session.username;
    const regex = new RegExp(escapeRegex(search_query), 'gi');

    Movie.find({"movieName" : regex})
      .then((result) => {
        result = shuffleArray(result);
        result.forEach((movieName) => {
          movieNameArray.push(movieName.movieName);
        })
        result.forEach((movieName) => {
          movieImageArray.push(movieName.movieImageName);
        })
        result.forEach((movieName) => {
          releaseYearArray.push(movieName.releaseYear);
        })
        return res.render("search", {movieNameArray, movieImageArray, releaseYearArray, username, search_query, amtOfResults : result.length});
    })
    .catch((err) => {
      console.log(err);
    })
  }else{
    return res.render("Search", {movieNameArray, movieImageArray, releaseYearArray, username, search_query, amtOfResults : 0});
  }
})

app.post('/likeOrDislike', (req, res) => {
  var username = req.session.username;
  var movieName = req.body.movieName;
  var likedOrDisliked = req.body.likedOrDisliked;
  var movieExists = false; // If movie previously has a like or dislike entry in DB

  // Find user to check their likes and dislikes
  Login.find({"username" : username})
  .then((result) => {
    //console.log(result);
    
    // Cycle through all likes and dislikes and checks if there is already a like or dislike entry in the DB
    result[0].movieOpinion.forEach(function(movieOpinion){
      if(movieOpinion.movieName == movieName){
        movieExists = true;
        movieOpinion.likedStatus = likedOrDisliked;
        const userData = new Login(result[0]);
        userData.save().then((newResult) => {
      
        }).catch((err) => {
          console.log(err);
        })
        //console.log("Update currently existing item");
      }
    });
    // If no movie likeStatus in DB create one
    //console.log("Create new entry");
    if(!movieExists){
      Login.findOneAndUpdate({'username' : username}, {$push : {"movieOpinion" : {movieName: movieName, likedStatus: likedOrDisliked}}}, {upsert: true}, function(err, doc) {
        if (err){console.log("Update Failed");}else{console.log('Succesfully saved.');}
      });
    }
  })
  .catch((err) => {
    console.log(err);
  })
          
});

app.get('/play-movie', (req, res) => {
  var movie_query = decodeURI(req._parsedUrl.query);

  Movie.find({"movieName" : movie_query})
  .then((result) => {
    console.log(result[0].movieFileName);

    // Ensure there is a range given for the video
    range = req.headers.range;
    if (!range) {
      range = 'bytes=0-';
    }
    
    // get video stats 
    const videoPath = "public/videos/" + result[0].movieFileName;
    const videoSize = fs.statSync(videoPath).size;
    
    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    
    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);
    
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
    
    // Stream the video chunk to the client
    videoStream.pipe(res);

  })
  .catch((err) => {
    console.log(err);
  })  
});

app.get('/addmovie', (req, res) => {
  return res.render("AddMovies", {alertShow: ""});
  //res.sendFile(__dirname + '/LoginPage.html');
});

app.get('/moviePage', (req, res) => {
    return res.render("moviePage");
    //res.sendFile(__dirname + '/LoginPage.html');
  });

app.get('/show-movie', (req, res) => {
  var movie_query = decodeURI(req._parsedUrl.query);
  var username = req.session.username;
  var movieLikeStatus = "neutral";
  console.log(movie_query);


  Login.find({"username" : username})
  .then((result) => {
    //console.log(result);

    // Checks all users for their like status' of the current movie to send the movie page
    result[0].movieOpinion.forEach(function(movieOpinion){
      if(movieOpinion.movieName == movie_query){
        movieLikeStatus = movieOpinion.likedStatus;
      }
    });

    Movie.find({"movieName" : movie_query})
    .then((result2) => {
    //console.log(result2);

    return res.render("moviePage", {
      movieName : result2[0].movieName,
      releaseYear : result2[0].releaseYear,
      description : result2[0].description,
      movieImageName : result2[0].movieImageName,
      rating : result2[0].rating,
      runtime : result2[0].runtime,
      category : result2[0].category,
      username : username,
      movieLikeStatus
    });
  })
  .catch((err) => {
    console.log(err);
  })

  })
  .catch((err) => {
    console.log(err);
  })
});

app.get('/category', (req, res) => {
  var category_query = decodeURI(req._parsedUrl.query);
  var movieNameArray = new Array();
  var movieImageArray = new Array();
  var releaseYearArray = new Array();
  var username = req.session.username;
  console.log(category_query);

  Movie.find({"category" : category_query})
  .then((result) => {
    console.log(result);
    result = shuffleArray(result);
      result.forEach((movieName) => {
        movieNameArray.push(movieName.movieName);
      })
      result.forEach((movieName) => {
        movieImageArray.push(movieName.movieImageName);
      })
      result.forEach((movieName) => {
        releaseYearArray.push(movieName.releaseYear);
      })
      return res.render("categoryType", {movieNameArray, movieImageArray, releaseYearArray, username});
  })
  .catch((err) => {
    console.log(err);
  })
});

app.get('/home', (req, res) => {

  // If user is not logged in with a valid session cookie, reject them

  req.session.reload(function(err) {
    // session updated
    if(err) console.log("Could not load session of user!");
    else console.log(req.session.username);
  })

  console.log(req.session);
  if(!req.session.username) {
    return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
  }

  var movieNameArray = new Array();
  var movieImageArray = new Array();
  var releaseYearArray = new Array();
  var username = req.session.username;

  Movie.find({})
    .then((result) => {
      result = shuffleArray(result);
      result.forEach((movieName) => {
        movieNameArray.push(movieName.movieName);
      })
      result.forEach((movieName) => {
        movieImageArray.push(movieName.movieImageName);
      })
      result.forEach((movieName) => {
        releaseYearArray.push(movieName.releaseYear);
      })
      return res.render("Home", {movieNameArray, movieImageArray, releaseYearArray, username});
  })
  .catch((err) => {
     console.log(err);
   })
});

app.get('/register', (req, res) => {
  return res.render("registration", {alertShow: ""})
  //res.sendFile(__dirname + '/RegisterPage.html');
});

app.post('/register', (req, res) => {
  return res.render("registration", {alertShow: ""})
  //res.sendFile(__dirname + '/RegisterPage.html');
});

app.post('/movie-addition', urlencodedParser, (req, res) => {
  var movieName = req.body.movieName;
  var releaseYear = req.body.releaseYear;
  var description = req.body.description;
  var movieImageName = req.body.movieImageName;
  var movieFileName = req.body.movieFileName;
  var rating = req.body.rating;
  var runtime = req.body.runtime;
  var category = req.body.category;

  console.log("Received new movie information:");
  console.log("");

  console.log(movieName);
  console.log(releaseYear);
  console.log(description);
  console.log(movieImageName);
  console.log(movieFileName);
  console.log(rating);
  console.log(runtime + " mins");
  console.log(category);

  console.log("");
  console.log("");

  const movie = new Movie({
    movieName: movieName,
    releaseYear: releaseYear,
    description: description,
    movieImageName: movieImageName,
    movieFileName: movieFileName,
    rating: rating,
    runtime: runtime,
    category: category
  });

  movie.save()
      .then((result) => {
        console.log("Movie JSON data:");
        console.log("");
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      })

  return res.render("AddMovies", {alertShow: ""});

});

app.post('/registration-confirmation', urlencodedParser, (req, res) => {
  var emailInput = req.body.email;
  var usernameInput = req.body.username;
  var passwordInput = req.body.password;
  var confirmPasswordInput = req.body.passwordConfirm;

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
         password: hash
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
         return res.sendFile(__dirname + '/RegistrationSuccess.html');
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

            // Set username in cookie
            req.session.username = user.username;

            // Copy Paste from above, for now...

            var movieNameArray = new Array();
            var movieImageArray = new Array();
            var releaseYearArray = new Array();
            var username = req.session.username;

            Movie.find({})
              .then((result) => {
                result.forEach((movieName) => {
                  movieNameArray.push(movieName.movieName);
                })
                result.forEach((movieName) => {
                  movieImageArray.push(movieName.movieImageName);
                })
                result.forEach((movieName) => {
                  releaseYearArray.push(movieName.releaseYear);
                })
                return res.redirect('/home');
            })
            .catch((err) => {
               console.log(err);
             })
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

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};