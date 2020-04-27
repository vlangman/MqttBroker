DROP TABLE ADVDATA;
DROP TABLE KGATEWAY;
DROP TABLE KBEACON;

CREATE TABLE KGATEWAY(
GatewaySeqNo  INTEGER PRIMARY KEY AUTOINCREMENT,
GatewayName VARCHAR(40) NOT NULL UNIQUE,
MacAddress VARCHAR(12) NOT NULL UNIQUE
);


CREATE TABLE KBEACON(
BeaconSeqNo  INTEGER PRIMARY KEY AUTOINCREMENT,
BeaconName VARCHAR(40) NOT NULL UNIQUE,
MacAddress VARCHAR(12) NOT NULL UNIQUE
);

CREATE TABLE ADVDATA(
AdvDataSeqNo INTEGER PRIMARY KEY AUTOINCREMENT,
Message VARCHAR(80) NOT NULL,
Rssi INTEGER NOT NULL,
GatewaySeqNo VARCHAR(12) NULL,
BeaconSeqNo VARCHAR(12) NOT NULL,
MessageIndex INTEGER,
TimeStamp TEXT,
FOREIGN KEY (GatewaySeqNo) REFERENCES KGATEWAY(GatewaySeqNo),
FOREIGN KEY (BeaconSeqNo) REFERENCES KBEACON(BeaconSeqNo)
);

INSERT INTO KGATEWAY (GatewayName, MacAddress) VALUES("Kgateway1", "D03304003302");
INSERT INTO KBEACON (BeaconName, MacAddress) VALUES("k8_Beacon", "DD330A020541");

