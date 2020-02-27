const sqlite3 = require('sqlite3').verbose();

class db {
    static instance = null;
 
    constuctor() {
        createInstance();
    }

    createInstance(){
        this.instance = new sqlite3.Database(':memory:', (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the in-memory SQlite database.');
          });
    }
 
    getConnection() {
        if (!this.instance) {
            this.createInstance();
        }
        return this.instance;
    }
    
    closeConnection(){
        this.instance.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Closed the database connection.');
          });
    }

    test(){
        let instance1 = this.getConnection();
        let instance2 = this.getConnection();
        console.log("Same instance? " + (instance1 === instance2));  
    }

};
 
let db = new db()
db.test();
db.closeConnection();

module.exports = db;