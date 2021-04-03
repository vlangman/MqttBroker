# MqttBroker

node js server that listens to mqtt brokers and subscribes to store their rssi data pings in a sqllite3 server.

sqlite3 db can be setup/reset by running  ```init_database.sql``` in your sqllite3 client of choice.
*note this api will subscribe to all gateways contained within the database KGateway table.


This server exposes an api layer used to process/manipulate and serve mqtt broker, beacons and gateways 
for the system

a postman collection for the API can be downloaded / viewed here 
https://www.getpostman.com/collections/65461e4fe9cb36077414

Schemas for api requests can be found in  📁```schema``` folder.

ensure your config.json has been set correctly for mqtt broker username/pass and port.

start the server with ```node server.js```
