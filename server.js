let app = require("./app.js")
let brokerService = require("./broker.js")
const port = 3000

//init broker service and fetch client
let broker = new brokerService();
let client = broker.getClient();

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

client.on('connect', function () {
	broker.subscribeToClients();
})

client.on('message', function (topic, message) {
	console.log(message.toString());
})