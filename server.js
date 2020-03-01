let app = require("./app.js")
let brokerService = require("./broker.js")
const port = 3000


//init broker service and fetch client
let broker = new brokerService();

let client = null;

(async() =>{
	await broker.startBroker();
	await broker.configureDatabase();
	client = broker.getClient();

	client.on('message', function (topic, message) {
		console.log("HANDLING MESSAGE: " + message);
		broker.handleMessage(message.toJSON());

	})
})();


app.get('/', (req, res) => res.send('Hello World!'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))