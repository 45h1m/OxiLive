const readDB = require('./readDB');
const writeDB = require('./writeDB');

module.exports = async function(req, res){

    try {
        
        let users = await readDB('./db/users.json');
        let devices = await readDB('./db/devices.json');

        users = users.filter(user => user.email !== req.authData.trim());

        devices = devices.map(device => {

            if(device.email === req.authData) {
                device.email = null;
                return device;
            }

            return device;
        });

        const writeStatus = await writeDB(users, './db/users.json');
        const devicesWriteStatus = await writeDB(devices, './db/devices.json');

        console.log(writeStatus);
        console.log(devicesWriteStatus);

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