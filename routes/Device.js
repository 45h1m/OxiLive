const express = require("express");
const Router = express.Router();
const deviceController = require('../controllers/deviceController');
const authorize = require("../controllers/authorize");

Router.get('/update/:deviceID', deviceController.updateData);
Router.post('/dates', authorize, deviceController.sendDates);
Router.post('/dates/:date', authorize, deviceController.sendSpecific);
Router.post('/realtime', authorize, deviceController.sendRealtime);

module.exports = Router;