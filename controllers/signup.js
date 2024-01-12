const readDB = require("../controllers/readDB");
const writeDB = require("../controllers/writeDB");

module.exports = async (req, res) => {

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
}