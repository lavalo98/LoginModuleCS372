const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new mongoose.Schema({
    email: { // Email Address
      type: String,
      required: false,
      default: ""
    },
    username: { // Username
        type: String,
        required: true
    },
    password: { // Password
        type: String,
        required: true
    },
    role: {
      type: Number,
      default: 0
      /*
       * 0 : viewer
       * 1 : content editor
       * 2 : marketing manager
       * 3+ : possible admin role
      */
    },
    lastFailedLoginTime: { // Time of last failed login attempt
        type: Date,
        default: Date.now
    },
    failedLoginAttempts: { // # of failed login attempts
        type: Number,
        default: 0
    },
    expirationDate: { // When a locked account will unlock
        type: Date,
        default: Date.now
    },
    moviesWatched: { // How many movies the user has watched today
      type: Number,
      default: 0
    },
    movieOpinion: [{
        movieName: String,
        likedStatus: String,
    }]

    //TODO: PROFILES
    //Possibly an array of profile objects?

}, {timestamps: true});

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;
