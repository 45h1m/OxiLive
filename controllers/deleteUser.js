const readDB = require('./readDB');
const writeDB = require('./writeDB');

module.exports = async function(req, res){

    try {
        
        let users = await readDB('./db/users.json');

        users = users.filter(user => user.email !== req.authData.trim());

        const writeStatus = await writeDB(users, './db/users.json');

        console.log(writeStatus);

        res.status(200).json({
            message: "User "+ req.authData +" deleted"
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Deletion unsuccessful"
        });
    }
}