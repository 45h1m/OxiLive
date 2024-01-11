const readDB = require('./readDB');

module.exports = async function(req, res){

    const email = req.authData;

    try {

        const users = await readDB('./db/users.json');

        const user = users.find(user => user.email === email);

        res.status(200).json(user);
        
    } catch (error) {

        console.log(error);
        res.status(400).json({
            error: "Something went wrong",
            message: "Something went wrong"
        });
    }

}