const express = require("express");
const Router = express.Router();
const otpController = require("../controllers/otpController");
const jwt = require("jsonwebtoken");
const readDB = require("../controllers/readDB");
const writeDB = require("../controllers/writeDB");
const authorize = require("../controllers/authorize");
const sendUserData = require('../controllers/sendUserData');
const deleteUser = require('../controllers/deleteUser');
let users = null;

Router.post("/generate", async (req, res) => {
    if (!req.body.email) {
        return res.status(401).json({
            error: "Provide email",
            message: "Provide email",
        });
    }

    const email = req.body.email;

    const status = await otpController.generateOTP(email);

    if (!status) {
        return res.status(401).json({
            error: "verification failed",
            message: "Verification failed",
        });
    }

    return res.status(200).json({
        message: "OTP sent to: " + email,
    });
});

Router.post("/verify", async (req, res) => {
    if (!req.body.email || !req.body.otp) {
        return res.status(401).json({
            error: "Provide email & otp",
            message: "Provide email & otp",
        });
    }

    try {
        const status = await otpController.verifyOTP(req.body.email, req.body.otp);

        if (!status) {
            return res.status(401).json({
                error: "Verification failed",
                message: "Verification failed",
            });
        }

        const token = jwt.sign(req.body.email, process.env.JWT_SECRET);

        users = await readDB("./db/users.json");

        const userExists = users.find((user) => user.email === req.body.email);

        if (!userExists) {
            users.push({
                email: req.body.email,
                name: null,
                dob: null,
                deviceID: null,
            });

            const writeStatus = await writeDB(users, "./db/users.json");
            console.log(writeStatus);
        }

        res.cookie("token", token);

        res.status(200).json({
            message: "Email verified",
            token: token,
            accountComplete: userExists && userExists.deviceID ? true : false,
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            error: "Verification failed",
            message: "Verification failed",
        });
    }
});

Router.post("/signup", authorize, async (req, res) => {

    try {
        let users = await readDB("./db/users.json");

        const user = users.find((user) => user.email === req.authData);

        if (!user) {
            console.log("Email not verified");

            return res.status(401).json({
                error: "Email not verified",
                message: "Email not verified",
            });
        }

        if (user.deviceID) {
            console.log("already signed up");

            return res.status(402).json({
                error: "User already signed up",
                message: "User already signed up",
            });
        }

        if(!(req.body.name && req.body.dob && req.body.deviceID))
        return res.status(400).json({
            error: "Provide all fields",
            message: "Provide all fields"
        });

        users = users.map((user) => {
            if (user.email === req.authData) {
                user.name = req.body.name;
                user.dob = req.body.dob;
                user.deviceID = req.body.deviceID;

                return user;
            }

            return user;
        });


        const writeStatus = await writeDB(users, "./db/users.json");

        console.log(writeStatus);

        res.status(200).json({
            message: "Signup successful"
        });


    } catch (err) {

        console.log(err);

        res.status(400).json({

            error: "Signup failed",
            message: "Signup failed",
        });
    }
});

Router.post('/userData', authorize, sendUserData);
Router.post('/delete', authorize, deleteUser);

module.exports = Router;
