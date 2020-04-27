const db = require("../database.js");
const scripts = require('../scripts.json');
let database = new db();
let Ajv = require('ajv');


let kBeaconSchema = require('../schemas/kBeacon/kBeaconSchema.json')
let getBeaconSchema = require('../schemas/kBeacon/Select.json')
let insertBeaconSchema = require('../schemas/kBeacon/Insert.json')
let updateBeaconSchema = require('../schemas/kBeacon/Update.json')

let ajv = new Ajv({schemas: [kBeaconSchema,getBeaconSchema,insertBeaconSchema,updateBeaconSchema]});


const mapStructure = (structureToMap, data)=>{
    //ensure you shallow copy the objects , database objects should be trivally copyable 
    let struct = Object.assign({},structureToMap)
    for (key in data) {
        struct[key] = data[key];
    }
    return struct;
}


const renderError = (res, err, devMessage, status = 500)=>{
    let object = {}
    object.err = err;
    object.devMessage = devMessage
    object.stringErr = JSON.stringify(err);
    res.status(status).render('error', object);
}

// Create and Save a new beacon or gateway
module.exports.create = (req, res) => {
    let validate = ajv.compile(insertBeaconSchema);
    let valid = validate(req.body);
    if (!valid){ 
        renderError(res,validate.errors[0],"Request Parameter Validation Errors")
    }else{
        let structures = [];
        for(struct in req.body)
            structures.push(mapStructure(scripts.KBEACON.STRUCTURE, req.body[struct]));

        database.insertMany(scripts.KBEACON.INSERT_ONE.SQL, structures).then((result)=>{
            res.json({"InsertSuccessful": result});
        }).catch(err=>{
            renderError(res,err,"An insert beacons database error occured")
        });
    }
};

// Find a single beacon or gateway with a by mac address or index
module.exports.get = (req, res) => {
    try {
        let validate = ajv.compile(getBeaconSchema);
        let valid = validate(req.body);
        if (!valid){ 
            renderError(res,validate.errors[0],"Request Parameter Validation Errors")
        }else{
            let structures = [];
            for(struct in req.body)
                structures.push(mapStructure(scripts.KBEACON.STRUCTURE, req.body[struct]));

            database.get(scripts.KBEACON.SELECT_ONE.SQL, structures).then((result)=>{
                res.json(result);
            }).catch(err=>{
                renderError(res,err,"A fetch beacons database error occured")
            });
        }
    }
    catch(err){
        renderError(res,err,"Internal Server Error")
    }
};

module.exports.getAll = (req, res) => {
    try {
        database.getAll(scripts.KBEACON.SELECT_ALL.SQL).then((result)=>{
            res.json(result);
        }).catch(err=>{
            renderError(res,err,"A fetch all beacons database error occured")
        });
    }
    catch(err){
        renderError(res,err,"Internal Server Error")
    }
};

// Update a beacon or gateway identified by the macAdress or Id in the request
module.exports.update = (req, res) => {
    try{
        let validate = ajv.compile(updateBeaconSchema);
        let valid = validate(req.body);
        if (!valid){ 
            renderError(res,validate.errors[0],"Request Parameter Validation Errors")
            res.json(validate.errors[0]);
        }else{
            let structures = [];
            for(struct in req.body)
                structures.push(mapStructure(scripts.KBEACON.STRUCTURE, req.body[struct]));
    
            database.insertMany(scripts.KBEACON.UPDATE_ONE.SQL, structures).then((result)=>{
                res.json({"InsertSuccessful": result});
            }).catch(err=>{
                renderError(res,err,"An update beacons database error occured")
            });
        }
    }
    catch(err){
        renderError(res,err,"Internal Server Error")
    }
    
};

// Delete a note with the specified noteId in the request
module.exports.delete = (req, res) => {

};