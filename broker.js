let mqtt = require('mqtt')
let client  = mqtt.connect([{
	username: 'Dave',
	password: 'kkmtest',
	port: 1883,
	host: 'localhost'
}]) 

let macList = [
	'D03304003302',
	'pick number 2 me lord!'
]

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
