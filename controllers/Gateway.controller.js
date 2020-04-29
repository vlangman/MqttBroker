const db = require("../database.js");
const scripts = require('../scripts.json');
let database = new db();
let Ajv = require('ajv');


let kGatewaySchema = require('../schemas/kGateway/kGatewaySchema.json')
let getGatewaySchema = require('../schemas/kGateway/Select.json')
let insertGatewaySchema = require('../schemas/kGateway/Insert.json')
let updateGatewaySchema = require('../schemas/kGateway/Update.json')
let deleteGatewaySchema = require('../schemas/kGateway/Delete.json')

let ajv = new Ajv({ schemas: [kGatewaySchema, getGatewaySchema, insertGatewaySchema, updateGatewaySchema, deleteGatewaySchema] });

const mapStructure = (structureToMap, data) => {
    //ensure you shallow copy the objects , database objects should be trivally copyable 
    let struct = Object.assign({}, structureToMap)
    for (key in data)
        struct[key] = data[key];
    return struct;
}

const renderError = (res, err, devMessage, status = 500) => {
    let object = {}
    object.err = err;
    object.devMessage = devMessage
    object.stringErr = JSON.stringify(err, null, 4)
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
    try {
        let validate = ajv.compile(insertGatewaySchema);
        let valid = validate(req.body);
        if (!valid) {
            console.log(validate.errors)
            res.json(validate.errors);
        } else {
            let structures = [];
            for (struct in req.body)
                structures.push(mapStructure(scripts.KGATEWAY.STRUCTURE, req.body[struct]));
            database.ExecuteStatement(scripts.KGATEWAY.INSERT_ONE.SQL, structures).then((result) => {
                renderSuccess(res, result, "Insert Gateway Successful")
            }).catch(err => {
                res.json({ "Insert Successful": false, "error": err.message });
            });
        }
    } catch (err) {
        renderError(res, err, "Internal Server Error")
    }

};

// Retrieve and return gateway based on params sent in each obj
module.exports.get = (req, res) => {
    try {
        let validate = ajv.compile(getGatewaySchema);
        let valid = validate(req.body);
        if (!valid) {
            renderError(res, validate.errors[0], "Request Parameter Validation Errors")
        } else {
            let structures = [];
            for (struct in req.body)
                structures.push(mapStructure(scripts.KGATEWAY.STRUCTURE, req.body[struct]));
            database.get(scripts.KGATEWAY.SELECT_ONE.SQL, structures).then((result) => {
                renderSuccess(res, result, "Get Gateway Successful");
            }).catch(err => {
                renderError(res, err, "A Get gateway gateways database error occured")
            });
        }
    }
    catch (err) {
        renderError(res, err, "Internal Server Error")
    }
};

// Find a single beacon or gateway with a by mac address or index
module.exports.getAll = (req, res) => {
    try {
        database.getAll(scripts.KGATEWAY.SELECT_ALL.SQL).then((result) => {
            renderSuccess(res, result, "Get All Gateway Successful");
        }).catch(err => {
            renderError(res, err, "A fetch all gateways database error occured")
        });
    }
    catch (err) {
        renderError(res, err, "Internal Server Error")
    }
};

// Update a beacon or gateway identified by the macAdress or Id in the request
module.exports.update = (req, res) => {
try {
    let validate = ajv.compile(updateGatewaySchema);
    let valid = validate(req.body);
        if (!valid) {
            renderError(res, validate.errors[0], "Request Parameter Validation Errors")
        } else {
            let structures = [];
            for (struct in req.body)
                structures.push(mapStructure(scripts.KGATEWAY.STRUCTURE, req.body[struct]));
            database.ExecuteStatement(scripts.KGATEWAY.UPDATE_ONE.SQL, structures).then((result) => {
                renderSuccess(res, result, "Update Gateway Successful");
            }).catch(err => {
                renderError(res, err, "A update beacons database error occured")
            });
        }
    }
    catch (err) {
        renderError(res, err, "Internal Server Error")
    }
};

// Delete a note with the specified noteId in the request
module.exports.delete = (req, res) => {
    try {
        let validate = ajv.compile(deleteGatewaySchema);
        let valid = validate(req.body);
        if (!valid) {
            renderError(res, validate.errors[0], "Request Parameter Validation Errors")
        } else {
            let structures = [];
            for (struct in req.body)
                structures.push(mapStructure(scripts.KGATEWAY.STRUCTURE, req.body[struct]));
            database.ExecuteStatement(scripts.KGATEWAY.DELETE_ONE.SQL, structures).then((result) => {
                renderSuccess(res, result, "Delete Gateway Successful");
            }).catch(err => {
                renderError(res, err, "A delete beacons database error occured")
            });
        }
    }
    catch (err) {
        renderError(res, err, "Internal Server Error")
    }
};