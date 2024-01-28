const readDB = require('./readDB');
const writeDB = require('./writeDB');
const readDir = require('./readDir');
const deleteDB = require('./deleteDB');

module.exports = async function(req, res){

    try {
        
        let users = await readDB('./db/users.json');
        let devices = await readDB('./db/devices.json');

        const device = devices.find(device => device.email === req.authData);
        const id = device.deviceID;

        users = users.filter(user => user.email !== req.authData.trim());

        devices = devices.map(device => {

            if(device.email === req.authData) {
                device.email = null;
                return device;
            }

            return device;
        });

        const files = await readDir('./db/device_data/'+ id+'/');
        
        if(files.length > 0) files.forEach(async file => {
            console.log(file);
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