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
	}

	startBroker = async() =>{
		return new Promise((Resolve)=>{
			this.client  = mqtt.connect([{
				username: defaultConfig.brokerConnection.username,
				password: defaultConfig.brokerConnection.password,
				port: defaultConfig.brokerConnection.port,
				host: defaultConfig.brokerConnection.host
			}]);
			this.client.on('connect', async() => {
				await this.subscribeToClients();
				console.log("Client Started")
				Resolve(true);
			})
		})
		
	}

	closeBroker = async() =>{
		// probably a close call 
		await db.close();
	}

	configureDatabase = async() =>{
		await db.open('./gateway.db').then((data)=>{
			console.log(data);
		});
	}

	getClient(){
		if (!this.client){
			throw new Exception("Client not instantiated :(");
		}
		return this.client;
	}

	//expect message in json format
	handleMessage = async(message) =>{
		return new Promise(Resolve =>{
			try{
				if (message.msg == "advData"){
					db.get(scripts.VALIDATION.MAC_ADDRESS.SQL, null).then((success)=>{
						if (success){
							console.log(success);
							// await db.run(scripts.ADVDATA)

						}
					});

				}else{
					Resolve(true);
				}
			}catch(err){
				console.log(err)
			}
		
		});
	}

	subscribeToClients = async() =>{
		count = 0;
		macList.forEach(mac =>{
			this.client.subscribe('kbeacon/publish/'+mac, function (err) {
				return new Promise((Resolve, Reject)=>{
					if (!err) {
						console.log('Subscribed to: ' + mac);
					}else{
						console.log('Failure subscribing to: ' + mac);
						Reject(true);
					}
					if (count == macList.length())
						Resolve(true);
				});
					
			})
		}); 
		
	}
	
}


module.exports = broker;