let app = require("./app.js")
let brokerService = require("./broker.js")
const port = 4200


//init broker service and fetch client
let broker = new brokerService();
let client = null;

// broker.handleMessage(JSON.parse('{"msg":"advData","gmac":"D03304003302","obj":[{"dmac":"4105020A33DD","rssi":"-50","data1":"0201061AFF4C0002157777772E6B6B6D636E2E636F6D00000100010001C5"}],"seq":181}'));

broker.startBroker().then(async()=>{
    await broker.subscribeToClients();
    client = broker.getClient();
    client.on('connect', function (topic, message) {
        console.log("Broker Connected");
    })
    client.on('message', function (topic, message) {
        console.log(message.toString());
        broker.handleMessage(message);
    })
});

app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
