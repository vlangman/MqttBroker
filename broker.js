let mqtt = require('mqtt')

const config = require('./config.json');
const defaultConfig = config.development;
// const environment = process.env.NODE_ENV || 'development';

let macList = [
	'D03304003302',
	'pick number 2 me lord!'
]

class broker {

	constructor(){
		this.startBroker();
	}

	startBroker(){
		this.client  = mqtt.connect([{
			username: defaultConfig.brokerConnection.username,
			password: defaultConfig.brokerConnection.password,
			port: defaultConfig.brokerConnection.port,
			host: defaultConfig.brokerConnection.host
		}]) 
	}

	closeBroker(){
		// probably a close call 
	}

	getClient(){
		return this.client;
	}

	
}

module.exports = broker;