const db = require("./../database.js");
let database = new db();


// Create and Save a new beacon or gateway
module.exports.create = (req, res) => {
    console.log(req);
    res.send(req.params);
};

// Retrieve and return all beacons or gateways     
module.exports.findAll = (req, res) => {

};

// Find a single beacon or gateway with a by mac address or index
module.exports.findOne = (req, res) => {

};

// Update a beacon or gateway identified by the macAdress or Id in the request
module.exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
module.exports.delete = (req, res) => {

};