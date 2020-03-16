let app = require("./app.js")
let brokerService = require("./broker.js")
const port = 4200


//init broker service and fetch client
let broker = new brokerService();

broker.startBroker().then(()=>{
    broker.getClient().on('connect', function () {
        broker.subscribeToClients();
    })
    
    broker.getClient().on('message', function (topic, message) {
        console.log(message.toString());
    })
});

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