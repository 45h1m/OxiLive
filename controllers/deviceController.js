const readDB = require("../controllers/readDB");
const writeDB = require("../controllers/writeDB");
const readDir = require('./readDir');

let realtimeData = [];


async function initDeviceList() {
    try {
        const devices = await readDB("./db/devices.json");

        devices.map(async (device) => {

            realtimeData.push({
                deviceID: device.deviceID,
                email: device.email,
                status: false,
                data: [],
            });
        });
    } catch (err) {
        console.log(err);
    }
}

initDeviceList();

async function writeData() {

    const currentISTDate = getISTDateTime().split(',')[0].trim();

    try {
        
        realtimeData.forEach(async device => {

            const writeStatus = await writeDB(device.data, `./db/device_data/${device.deviceID}/${currentISTDate}.json`);
            console.log(writeStatus);
        });

    } catch (err) {
        console.log(err);
    }
}

setTimeout(writeData, 1000 * 120);

function updateData(req, res) {

    const deviceID = req.params.deviceID;

    if(!deviceID) {
        return res.status(401).json({
            error: "Provide device ID",
            message: "Provide Device ID",
        });
    }

    if (!req.query.bpm || !req.query.oxygen) {
        return res.status(401).json({
            error: "provide bpm & oxygen",
            message: "Provide bpm & oxygen",
        });
    }

    let deviceExists = false;

    realtimeData = realtimeData.map(device => {

        if(device.deviceID === deviceID) {

            const currentIST = getISTDateTime().split(',')[1].trim();
            
            device.data.push(
                [currentIST, req.query.bpm, req.query.oxygen]
            );

            device.status = true;
            deviceExists = true;

            return device;
        }

        return device;
    });

    if(!deviceExists) {
        return res.status(401).json({
            error: "Invalid device ID",
            message: "Invalid Device ID",
        });
    }

    res.status(200).send('ok');
}


async function sendDates(req, res) {

    try {

        const device = realtimeData.find(device => device.email === req.authData);

        const deviceID = device.deviceID;
        
        const directories = await readDir('./db/device_data');
        
        const dirExists = directories.find(dir => dir === deviceID);

        if(dirExists) {
             
            const dates = await readDir('./db/device_data/'+ dirExists);

            if(dates) {
                return res.status(200).json({dates: dates});
            }

            return res.status(400).json({
                error: "No data found"
            });
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Something went wrong",
            message: "Something went wrong"
        });
    }
}

async function sendSpecific(req, res) {

    const device = realtimeData.find(device => device.email === req.authData);

    const deviceID = device.deviceID;

    const date = req.params.date;

    let data = null;

    try {
        
        data = await readDB('./db/device_data/'+ deviceID+'/'+ date);

    } catch (err) {
        console.log(err);
        res.status(401).json({
            error: "Error"
        });
    }


    if(data) {

        return res.status(200).json({data: data});
    }

    return res.status(401).json({
        error: "No data found"
    });
}


function sendRealtime(req, res) {

    const device = realtimeData.find(device => device.email === req.authData);

    if(device.data.length <= 0) {

        return res.status(404).json({
            error: "No data found",
            message: "No data found",
            status: 404
        });
    }

    return res.status(200).json({
        timestamp: device.data[device.data.length-1][0],
        bpm: device.data[device.data.length-1][1],
        oxygen: device.data[device.data.length-1][2]
    });
}

function getISTDateTime() {
    const options = { timeZone: 'Asia/Kolkata' };
    const istDateTime = new Date().toLocaleString('en-US', options).replaceAll('/', '-');
    return istDateTime;
};

module.exports = { updateData, sendDates, sendSpecific, sendRealtime };
