var express = require('express');
var gatewayController = require('../controllers/Beacon.controller');
var beaconController = require('../controllers/Beacon.controller');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next)=>{
  res.render('home', { title: 'Express' });
});

// Create a new beacon or gateway
router.post('/kBeacon', beaconController.create);
router.post('/kGateway', gatewayController.create);

// Retrieve all beacons/gateway by search param in array of beacons/gateways
router.get('/kBeacon', beaconController.get);
router.get('/kGateway', gatewayController.get);

// Retrieve all  beacons/gateways with Id
router.get('/kBeacons', beaconController.getAll);
router.get('/kGateways', gatewayController.getAll);

// Update a beacon/gateway with Id
router.put('/kBeacon', beaconController.update);
router.put('/kGateway', gatewayController.update);

// Delete a beacon/gateway with Id
router.delete('/kBeacon', beaconController.delete);
router.delete('/kGateway', gatewayController.delete);

module.exports = router;
