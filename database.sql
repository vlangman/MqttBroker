CREATE TABLE ADVDATA(
AdvDataSeqNo INT PRIMARY KEY,
Message VARCHAR(80) NOT NULL,
Rssi INT NOT NULL,
GatewayMac INT NOT NULL,
BeaconMac INT NOT NULL,
MessageIndex INT,
TimeStamp TEXT
);

-- CREATE TABLE KGATEWAY(
-- GatewaySeqNo  INT PRIMARY KEY,
-- BeaconName VARCHAR(40) NOT NULL,
-- MacAddress VARCHAR(12) NOT NULL
-- );

-- CREATE TABLE KBEACON(
-- BeaconSeqNo  INT PRIMARY KEY,
-- BeaconName VARCHAR(40) NOT NULL,
-- MacAddress VARCHAR(12) NOT NULL
-- );


