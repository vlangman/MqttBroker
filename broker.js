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

	constructor(){
	}

	startBroker = async()=>{
			await db.open("./gateway.db");
			await this.connectMqtt();
			console.log("BROKER START SUCCESSFUL");
	}

	connectMqtt= async()=>{
		this.client  = await mqtt.connectAsync([{
			username: defaultConfig.brokerConnection.username,
			password: defaultConfig.brokerConnection.password,
			port: defaultConfig.brokerConnection.port,
			host: defaultConfig.brokerConnection.host
		}])
		this.client.on('connect', ()=> {
			console.log("MQTT BROKER CONNECTION ESTABLISHED");
			this.getClient().on('message', this.handleMessage(message));
			return;
		})
	}

	closeBroker = async() =>{
		// probably a close call 
		await db.close();
	}


	getClient(){
		if (!this.client){
			throw new Error("NO FUCKEN CLIENT M8 !!")
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
				// {"msg":"advData","gmac":"D03304003302","obj":[{"dmac":"4105020A33DD","rssi":"-50","data1":"0201061AFF4C0002157777772E6B6B6D636E2E636F6D00000100010001C5"}],"seq":179}
				if (message.msg == "advData"){
					await this.AdvInsert(message);
				}else{
					Resolve(true);
				}
			}catch(err){
				console.log(err)
			}
		
		});
	}

	AdvInsert = async(Message)=>{
		let objects = Message.obj;
		let tasks = [];
		objects.forEach(obj => {
			let struct = scripts.ADVDATA.INSERT_ONE.STRUCTURE;
			struct.$Message = obj.data1;
			struct.$Rssi = obj.rssi;
			struct.$GatewayMac = Message.gmac;
			struct.$BeaconMac = obj.dmac;
			struct.$MessageIndex = Message.seq;
			tasks.push(db.run(scripts.ADVDATA.INSERT_ONE.SQL, struct));
		});
		let result = await Promise.all(tasks) 
		return result;
	}

	advData = async(message)=>{
		// {"msg":"advData","gmac":"D03304003302","obj":[{"dmac":"4105020A33DD","rssi":"-58","data1":"0201061AFF4C0002157777772E6B6B6D636E2E636F6D00000100010001C5"}],"seq":180}
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