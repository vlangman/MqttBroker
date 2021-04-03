# MqttBroker

node js server that listens to mqtt brokers and subscribes to store their rssi data pings.


This server exposes an api layer used to process/manipulate and serve mqtt broker, beacons and gateways 
for the system

a postman collection for the API can be downloaded / viewed here 

https://www.getpostman.com/collections/65461e4fe9cb36077414

ensure your config.json has been set correctly for broker username/pass and port.

start the server with ```node server.js```
