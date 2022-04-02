/*
 * **********************************************************************************************
 * *                                                                                            *
 * *  Server.js                                                                                 *
 * *  Authors: Darian Marvel and Luis Avalo                                                     *
 * *  For: CS372 Software Construction Projects                                                 *
 * *                                                                                            *
 * **********************************************************************************************
*/


// Libraries
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session'); // Documentation: https://www.npmjs.com/package/express-session
const MongoStore = require('connect-mongo'); // Documentation: https://www.npmjs.com/package/connect-mongo

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

//Use MongoDB to store cookie data as well
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

//--------------------------------------------------------------------------------------------------------------
//
// ROUTES
//
// All code below this point routes page requests to the proper javascript file for handling
//
//--------------------------------------------------------------------------------------------------------------

// Routing to the login page
const loginRoute = require('./Routes/Login')
app.use('/', loginRoute)

// Routing to the Registration page
const registerRoute = require('./Routes/RegisterPage')
app.use('/register', registerRoute)

// Routing to the Registration Confirmation page
const regConfRoute = require('./Routes/RegistrationConfirmation')
app.use('/registration-confirmation', regConfRoute)

// Routing to the Homepage page
const homepageRoute = require('./Routes/Homepage')
app.use('/home', homepageRoute)

// Routing from the Logout Button
const logoutRoute = require('./Routes/Logout')
app.use('/logout', logoutRoute)

// Routing to the category page
const categoryRoute = require('./Routes/Category')
app.use('/category', categoryRoute)

// Routing to the Marketing Manager Dashboard page
const MMDashboardRoute = require('./Routes/MMDashboard')
app.use('/MMDashboard', MMDashboardRoute)

// Routing to the Movie Stats page
const movieStatsRoute = require('./Routes/movieStats')
app.use('/movieStats', movieStatsRoute)

// Routing to the Search page
const searchRoute = require('./Routes/Search')
app.use('/search', searchRoute)

// Routing to the Individual Movie page
const showMovieRoute = require('./Routes/showMovie')
app.use('/show-movie', showMovieRoute)

// Routing to the like or dislike functionality
const likeOrDislikeRoute = require('./Routes/likeOrDislike')
app.use('/likeOrDislike', likeOrDislikeRoute)

// Routing to the movie reviewing functionality
const reviewMovieRoute = require('./Routes/reviewMovie')
app.use('/reviewMovie', reviewMovieRoute)

// Routing to the remove movie review functionality
const removeReviewRoute = require('./Routes/removeMovie')
app.use('/removeReview', removeReviewRoute)

// Routing to the viewer comment functionality
const viewerCommentRoute = require('./Routes/viewerComment')
app.use('/viewerCommentMovie', viewerCommentRoute)

// Routing to the playing movie page
const playingMoviePageRoute = require('./Routes/playingMoviePage')
app.use('/playingMovie', playingMoviePageRoute)

// Routing to the playing movie functionality
const playingMovieRoute = require('./Routes/playMovie')
app.use('/play-movie', playingMovieRoute)

// Routing to the add movie page
const addMovieRoute = require('./Routes/addMovie')
app.use('/addmovie', addMovieRoute)

// Routing to the add movie functionality
const movieAdditionRoute = require('./Routes/movieAddition')
app.use('/movie-addition', movieAdditionRoute)
