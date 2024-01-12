const express = require("express");
const Router = express.Router();
const authorize = require("../controllers/authorize");
const sendUserData = require('../controllers/sendUserData');
const deleteUser = require('../controllers/deleteUser');
const signup = require("../controllers/signup");
const verifyOTP = require("../controllers/verifyOTP");
const generateOTP = require("../controllers/generateOTP");

Router.post("/generate", generateOTP);
Router.post("/verify", verifyOTP);
Router.post("/signup", authorize, signup);
Router.post('/userData', authorize, sendUserData);
Router.post('/delete', authorize, deleteUser);

module.exports = Router;
