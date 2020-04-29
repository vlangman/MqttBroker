const db = require("../database.js");
const scripts = require('../scripts.json');
let database = new db();
// let Ajv = require('ajv');

// let kBeaconSchema = require('../schemas/kBeacon/kBeaconSchema.json')

// let ajv = new Ajv({ schemas: [kBeaconSchema, getBeaconSchema, insertBeaconSchema, updateBeaconSchema, deleteBeaconSchema] });


const mapStructure = (structureToMap, data) => {
    //ensure you shallow copy the objects , database objects should be trivally copyable 
    let struct = Object.assign({}, structureToMap)
    for (key in data) {
        struct[key] = data[key];
    }
    return struct;
}

const renderError = (res, err, devMessage, status = 500) => {
    let object = {}
    object.err = err;
    object.devMessage = devMessage
    object.stringErr = JSON.stringify(err, null, 4);
    res.status(status).render('error', object);
}

const renderSuccess = (res, result, devMessage, status = 200) => {
    let object = {}
    object.result = JSON.stringify(result, null, 4);
    object.devMessage = devMessage
    res.status(status).render('success', object);
}

// Create and Save a new beacon or gateway
module.exports.create = (req, res) => {
    
};

// Find a single beacon or gateway with a by mac address or index
module.exports.get = (req, res) => {
    try {
        //if no data use getall
        if (Object.keys(req.body).length === 0){
            this.getAll(req,res);
            return;
        }
        var binds = [];
        database.get(scripts.ADVDATA.SELECT_ALL.SQL,binds).then((result) => {
            renderSuccess(res, result, "Get All Beacon Successful");
        }).catch(err => {
            renderError(res, err, "A fetch all beacons database error occured")
        });
    }
    catch (err) {
        renderError(res, err, "Internal Server Error")
    }
};


module.exports.getAll = (req, res) => {
    try {
        //if no data use getall
        database.getAll(scripts.ADVDATA.SELECT_ALL.SQL).then((result) => {
            renderSuccess(res, result, "Get All Beacon Successful");
        }).catch(err => {
            renderError(res, err, "A fetch all beacons database error occured")
        });
    }
    catch (err) {
        renderError(res, err, "Internal Server Error")
    }
};

// Update a beacon or gateway identified by the macAdress or Id in the request
module.exports.update = (req, res) => {
    // try {
    //     let validate = ajv.compile(updateBeaconSchema);
    //     let valid = validate(req.body);
    //     if (!valid) {
    //         renderError(res, validate.errors[0], "Request Parameter Validation Errors")
    //     } else {
    //         let structures = [];
    //         for (struct in req.body)
    //             structures.push(mapStructure(scripts.KBEACON.STRUCTURE, req.body[struct]));
    //         database.ExecuteStatement(scripts.KBEACON.UPDATE_ONE.SQL, structures).then((result) => {
    //             renderSuccess(res, result, "Update Beacon Successful");
    //         }).catch(err => {
    //             renderError(res, err, "A update beacons database error occured")
    //         });
    //     }
    // }
    // catch (err) {
    //     renderError(res, err, "Internal Server Error")
    // }
};

// Delete a note with the specified noteId in the request
module.exports.delete = (req, res) => {
    // try {

    //     let validate = ajv.compile(deleteBeaconSchema);
    //     let valid = validate(req.body);
    //     if (!valid) {
    //         renderError(res, validate.errors[0], "Request Parameter Validation Errors")
    //     } else {
    //         let structures = [];
    //         for (struct in req.body)
    //             structures.push(mapStructure(scripts.KBEACON.STRUCTURE, req.body[struct]));
    //         database.ExecuteStatement(scripts.KBEACON.DELETE_ONE.SQL, structures).then((result) => {
    //             renderSuccess(res, result, "Delete Beacon Successful");
    //         }).catch(err => {
    //             renderError(res, err, "A delete beacons database error occured")
    //         });
    //     }
    // }
    // catch (err) {
    //     renderError(res, err, "Internal Server Error")
    // }
};