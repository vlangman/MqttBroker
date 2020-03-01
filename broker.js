const mqtt = require('mqtt')
const scripts = require('./scripts.json')
const config = require('./config.json');
const defaultConfig = config.development;
const db = require("./database.js")


let macList = [
	'D03304003302',
]

class broker {

	clientList = []

	constructor(){
		this.startBroker();
	}

	startBroker(){
		this.client  = mqtt.connect([{
			username: defaultConfig.brokerConnection.username,
			password: defaultConfig.brokerConnection.password,
			port: defaultConfig.brokerConnection.port,
			host: defaultConfig.brokerConnection.host
		}]);
	}

	closeBroker(){
		// probably a close call 
	}

	configureDatabase = async() =>{
		await db.open('./gateway.db').then((data)=>{
			console.log(data);
			
			db.all("Select * from ADVDATA").then(rows=>{
				rows.forEach(row=>{
					console.log(row)
				})
			})
		});
	}

	getClient(){
		return this.client;
	}

	subscribeToClients(){
		macList.forEach(mac =>{
			this.client.subscribe('kbeacon/publish/'+mac, function (err) {
				if (!err) {
					console.log('Subscribed to: ' + mac);
				}else{
					console.log('Failure subscribing to: ' + mac);
				}
			})
		}); 
		
	}
	
}


module.exports = broker;