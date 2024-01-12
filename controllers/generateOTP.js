const otpController = require("../controllers/otpController");

module.exports = async (req, res) => {
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
}