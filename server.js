let app = require("./app.js")
let brokerService = require("./broker.js")
const port = 3000

//init broker service and fetch client
let client = new brokerService().getClient();

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

client.on('connect', function () {
	client.subscribe('kbeacon/publish/'+macList[0], function (err) {
		if (!err) {
			console.log('Subscribed to: ' + macList[0]);
		}else{
			console.log('Failure subscribing to: ' + macList[0]);
		}
	})
})

client.on('message', function (topic, message) {
	// message is Buffer
	console.log(message.toString())
	client.end()
})