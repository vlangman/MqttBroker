const mqtt = require('mqtt')
const scripts = require('./scripts.json')
const config = require('./config.json');
const defaultConfig = config.development;
const db = require("./database.js")


//need to fetch this from DB 
let macList = [
	'D03304003302',
]

class broker {
	clientList = [];
	updateStack = [];
	client = null;
	database = null;

	constructor(){
		this.database = new db();
		this.startBroker();
	}

	startBroker = async()=>{
		this.client  = mqtt.connect([{
			username: defaultConfig.brokerConnection.username,
			password: defaultConfig.brokerConnection.password,
			port: defaultConfig.brokerConnection.port,
			host: defaultConfig.brokerConnection.host
		}]) 
	}


	closeBroker = async() =>{
		// probably a close call 
	}


	getClient(){
		if (!this.client){
			throw new Error("NO CLIENT !!")
		}
		return this.client;
	}


	AdvInsert = function (Message) {
		let objects = Message.obj;
		let result = []
		objects.forEach(obj => {
			let struct = Object.assign({}, scripts.ADVDATA.INSERT_ONE.STRUCTURE);
			struct.Message = obj.data1;
			struct.Rssi = obj.rssi;
			struct.GatewayMac = Message.gmac;
			struct.BeaconMac = obj.dmac.match(/.{2}/g).reverse().join().replace(/,/g, '');
			struct.MessageIndex = Message.seq;
			result.push(struct);
		});
		return result;
	}

	//expect message in json format
	handleMessage = async(message) =>{
		return new Promise(async(Resolve) =>{
			try{
				if (message.msg == "advData"){
					this.database.ExecuteStatement(scripts.ADVDATA.INSERT_ONE.SQL, AdvInsert(message))
				}else{
					Resolve(true);
				}
			}catch(err){
				console.log(err)
			}
		
		});
	}

	subscribeToClients(){
		this.database.getAll(scripts.KBEACON.SELECT_ALL.SQL).then((result)=>{
			result.forEach(beacon =>{
				console.log(beacon)
				this.client.subscribe('kbeacon/publish/'+ beacon.MacAddress, (err) =>{
					if (!err) {
						console.log(`Successful Subscription to ${beacon.BeaconName} - ${beacon.MacAddress}`);
					}else{
						console.log(`Failure subscribing to ${beacon.BeaconName} - ${beacon.MacAddress}`);
						console.log(err);
					}
				})
			}); 
		})
	
		
	}
	
}

module.exports = broker;