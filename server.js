let app = require("./app.js")
let brokerService = require("./broker.js")
const port = 4200


//init broker service and fetch client
let broker = new brokerService();
broker.startBroker();

broker.handleMessage(JSON.parse('{"msg":"advData","gmac":"D03304003302","obj":[{"dmac":"4105020A33DD","rssi":"-50","data1":"0201061AFF4C0002157777772E6B6B6D636E2E636F6D00000100010001C5"}],"seq":181}'));


app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))



//get beacons 

//get gateways

//addbeacon

//addgateway

//deletebeacon

//deleteGateway

//updateBeacon

//updateGateway


app.get('/', function (req, res) {
  
})