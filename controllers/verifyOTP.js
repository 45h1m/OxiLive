const readDB = require("../controllers/readDB");
const writeDB = require("../controllers/writeDB");
const otpController = require("../controllers/otpController");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
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
}