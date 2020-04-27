const db = require("../database.js");
const scripts = require('../scripts.json');
let database = new db();
let Ajv = require('ajv');


let kGatewaySchema = require('../schemas/kGateway/kGateway.json')
let getGatewaySchema = require('../schemas/kGateway/Select.json')
let insertGatewaySchema = require('../schemas/kGateway/Insert.json')

let ajv = new Ajv({schemas: [kGatewaySchema,getGatewaySchema,insertGatewaySchema]});

// Create and Save a new beacon or gateway
module.exports.create = (req, res) => {

};

// Retrieve and return all beacons or gateways     
module.exports.get = (req, res) => {
    try {
        let validate = ajv.compile(getGatewaySchema);
        let valid = validate(req.body);
        if (!valid){ 
            console.log(validate.errors)
            res.json(validate.errors);
        }else{
            let structures = [];
            for(struct in req.body)
                structures.push(mapStructure(scripts.KGATEWAY.STRUCTURE, req.body[struct]));
            database.get(scripts.KGATEWAY.SELECT_ONE.SQL, structures).then((result)=>{
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

// Find a single beacon or gateway with a by mac address or index
module.exports.getAll = (req, res) => {

};

// Update a beacon or gateway identified by the macAdress or Id in the request
module.exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
module.exports.delete = (req, res) => {

};