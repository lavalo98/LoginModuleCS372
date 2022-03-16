const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new mongoose.Schema({
    email: {
      type: String,
      required: false,
      default: ""
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastFailedLoginTime: {
        type: Date,
        default: Date.now
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    expirationDate: {
        type: Date,
        default: Date.now
    },

    //TODO: PROFILES

}, {timestamps: true});

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;
