const mqtt = require('async-mqtt')
const scripts = require('./scripts.json')
const config = require('./config.json');
const defaultConfig = config.development;
const db = require("./database.js")


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
	}

	startBroker = async()=>{
		return new Promise( async (Resolve)=>{
			await this.connectMqtt();
			console.log("BROKER START SUCCESSFUL");
			Resolve(this.client);
		})
			
	}

	connectMqtt= async()=>{
		return new Promise(async(Resolve)=>{
			this.client  = await mqtt.connectAsync([{
				username: defaultConfig.brokerConnection.username,
				password: defaultConfig.brokerConnection.password,
				port: defaultConfig.brokerConnection.port,
				host: defaultConfig.brokerConnection.host
			}])
			this.client.on('connect', ()=> {
				Resolve(1);
			})
		})
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


	reverse(string){
		return string.split("").reverse().join("");
	}

	//expect message in json format
	handleMessage = async(message) =>{
		return new Promise(async(Resolve) =>{
			try{
				if (message.msg == "advData"){
					this.database.insertMany(scripts.ADVDATA.INSERT_ONE.SQL, this.AdvInsert(message))
				}else{
					Resolve(true);
				}
			}catch(err){
				console.log(err)
			}
		
		});
	}

	AdvInsert(Message){
		let objects = Message.obj;
		let result = []
		objects.forEach(obj => {
			let struct = scripts.ADVDATA.INSERT_ONE.STRUCTURE;
			struct.Message = obj.data1;
			struct.Rssi = obj.rssi;
			struct.GatewayMac = Message.gmac;
			struct.BeaconMac =  obj.dmac.match(/.{2}/g).reverse().join().replace(/,/g,'');
			struct.MessageIndex = Message.seq;
			result.push(struct);
		});
		return result;
	}

	subscribeToClients(){
		return new Promise((Resolve)=>{
			let subs = [];
			macList.forEach(mac =>{
			subs.push(async ()=>{
				this.getClient().subscribe('kbeacon/publish/'+mac, function (err) {
					if(!err) {
						console.log('Subscribed to: ' + mac);
					}else{
						console.log('Failure subscribing to: ' + mac);
					}
					})
				})
			});
			Promise.all(subs).then(()=>{
				Resolve(1);
			})
		})
	}
	
}


module.exports = broker;