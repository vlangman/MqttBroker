

module.exports.AdvInsert = function (Message) {
    let objects = Message.obj;
    let result = []
    objects.forEach(obj => {
        let struct = scripts.ADVDATA.INSERT_ONE.STRUCTURE;
        struct.Message = obj.data1;
        struct.Rssi = obj.rssi;
        struct.GatewayMac = Message.gmac;
        struct.BeaconMac = obj.dmac.match(/.{2}/g).reverse().join().replace(/,/g, '');
        struct.MessageIndex = Message.seq;
        result.push(struct);
    });
    return result;
}

