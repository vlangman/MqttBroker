const db = require("../database.js");
const scripts = require('../scripts.json');
let database = new db();
let Ajv = require('ajv');


let kBeaconSchema = require('../schemas/kBeacon/kBeaconSchema.json')
let getBeaconSchema = require('../schemas/kBeacon/Select.json')
let insertBeaconSchema = require('../schemas/kBeacon/Insert.json')

let ajv = new Ajv({schemas: [kBeaconSchema,getBeaconSchema,insertBeaconSchema]});


const mapStructure = (structureToMap, data)=>{
    //ensure you shallow copy the objects , database objects should be trivally copyable 
    let struct = Object.assign({},structureToMap)
    for (key in data) {
        struct[key] = data[key];
    }
    return struct;
}


// Create and Save a new beacon or gateway
module.exports.create = (req, res) => {
    console.log(req.body);
    let validate = ajv.compile(insertBeaconSchema);
    let valid = validate(req.body);
    console.log(valid)
    if (!valid){ 
        console.log(validate.errors)
        res.json(validate.errors);
    }else{
        let structures = [];
        for(struct in req.body)
            structures.push(mapStructure(scripts.KBEACON.STRUCTURE, req.body[struct]));

        database.insertMany(scripts.KBEACON.INSERT_ONE.SQL, structures).then((result)=>{
            res.json({"InsertSuccessful": result});
        }).catch(err=>{
            console.log(err);
            res.json({"InsertSuccessful": false, "error":err.message});
        });
    }
};

// Find a single beacon or gateway with a by mac address or index
module.exports.get = (req, res) => {
    try {
        let validate = ajv.compile(getBeaconSchema);
        let valid = validate(req.body);
        if (!valid){ 
            console.log(validate.errors)
            res.json(validate.errors);
        }else{
            let structures = [];
            for(struct in req.body)
                structures.push(mapStructure(scripts.KBEACON.STRUCTURE, req.body[struct]));

            database.get(scripts.KBEACON.SELECT_ONE.SQL, structures).then((result)=>{
                res.json(result);
            }).catch(err=>{
                console.log(err);
                res.json(err);
            });
        }
    }
    catch(err){
        console.log(err);
        res.render('error', err);
    }
};

module.exports.getAll = (req, res) => {
    try {
        database.getAll(scripts.KBEACON.SELECT_ALL.SQL).then((result)=>{
            res.json(result);
        }).catch(err=>{
            console.log(err);
            res.json(err);
        });
    
    }
    catch(err){
        console.log(err);
        res.render('error', err);
    }
};

// Update a beacon or gateway identified by the macAdress or Id in the request
module.exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
module.exports.delete = (req, res) => {

};