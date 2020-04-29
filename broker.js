const mqtt = require('mqtt')
const scripts = require('./scripts.json')
const config = require('./config.json');
const defaultConfig = config.development;
const db = require("./database.js")

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
			struct.TimeStamp = String(Date.now());
			result.push(struct);
		});
		return result;
	}

	//expect message in json format
	handleMessage = async(message) =>{
		return new Promise(async(Resolve,Reject) =>{
			try{
				if (message.msg == "advData"){
					this.database.ExecuteStatement(scripts.ADVDATA.INSERT_ONE.SQL, this.AdvInsert(message)).then((success)=>{
						Resolve(success);
					}).catch(err=>{
						Reject(err);
					})
				}else{
					Resolve(true);
				}
			}catch(err){
				Reject(err);
			}
		
		});
	}

	subscribeToClients(){
		this.database.getAll(scripts.KGATEWAY.SELECT_ALL.SQL).then((result)=>{
			result.forEach(gateway =>{
				console.log(gateway)
				this.client.subscribe('kbeacon/publish/'+ gateway.MacAddress, (err) =>{
					if (!err) {
						console.log(`Successful Subscription to ${gateway.GatewayName} - ${gateway.MacAddress}`);
					}else{
						console.log(`Failure subscribing to ${gateway.GatewayName} - ${gateway.MacAddress}`);
						console.log(err.message);
					}
				})
			}); 
		})
	
		
	}
	
}

module.exports = broker;