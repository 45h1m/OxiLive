const readDB = require("../controllers/readDB");

let deviceStatus = [];

try {
    
    const devices = await readDB('./db.devices.json');

    devices.forEach(device => {
        
        deviceStatus.push([device.deviceId, 0]);
    });
    
} catch (err) {
    console.log(err);
}

setInterval(() => {

    deviceStatus.forEach(device => {

        if(device[1] > 0) device[1]--; 
    });

}, 1000 * 5);

module.exports = (deviceId) => {

    return deviceStatus.find(device => device[0] === deviceId)[1];
}