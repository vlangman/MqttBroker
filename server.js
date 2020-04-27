let app = require("./app.js")
let brokerService = require("./broker.js")
let db = require('./database.js')
db = new db();
const port = 3000
const beaconController = require('./controllers/Beacon.controller.js');


//init broker service and fetch client
console.log("Starting broker")
let broker = new brokerService();


// broker.handleMessage(JSON.parse('{"msg":"advData","gmac":"D03304003302","obj":[{"dmac":"4105020A33DD","rssi":"-50","data1":"0201061AFF4C0002157777772E6B6B6D636E2E636F6D00000100010001C5"}],"seq":181}'));


let client = broker.getClient();

client.on('connect', function (topic, message) {
    console.log("Broker Connected");
    broker.subscribeToClients();
})
broker.subscribeToClients();
client.on('message', function (topic, message) {
    console.log(message.toString());
    broker.handleMessage(message);
})

app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
