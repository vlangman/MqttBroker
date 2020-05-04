let app = require("./app.js")
let brokerService = require("./broker.js")
let db = require('./database.js')
db = new db();
const port = 3000

//rerout consolur out through pretty logger so json 
const clf = require('common-log-format')
process.stdin.pipe(new clf()).pipe(process.stdout)

//init broker service and fetch client
console.log("Starting broker")
const broker = new brokerService();

const client = broker.getClient();

client.on('connect', function (topic, message) {
    console.log("Broker Connected");
    broker.subscribeToClients();
})


client.on('message', (topic, msg)=>{
    console.log(msg);
    broker.handleMessage(topic,msg).then(success=>{
    }).catch(err=>{
        console.log(err.message)
    })
});

app.get('/', (req, res) => res.send('Hello World!'))

console.log(String(Date.now()))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
