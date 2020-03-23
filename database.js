const Database = require('better-sqlite3');



class database{
    // order of binds for all methods is to be sequential with the query parameters
    // use query STRUCTURE in TABLENAME.QUERYGROUP.QUERY.STRUCTURE to ensure ordering
    static instance = null

    instance(){
        if (!this.instance){
            console.log("connecting DB");
            return this.instance = new Database('gateway.db', { verbose: console.log });
        }
        return null
    }

    constructor(){
        this.instance();
    }


    async insertOne(query, binds){
        return new Promise((resolve, reject)=>{
            const insert = this.instance().prepare(query);
            const insertOne = this.instance().transaction(([binds]) => {
                insert.run(binds);
            });
            try{
                insertOne(binds);
                resolve(1);
            }
            catch(err){
                reject(err);
            };
        })
    }


    async insertMany(query, binds){
        return new Promise((resolve, reject)=>{
            const insert = this.instance().prepare(query);
            const insertMany = this.instance().transaction((dataarray) => {
                for (const binds of dataarray){
                    console.log(binds)
                    insert.run(binds);
                };
            });
            try{
                insertMany(binds);
                resolve(1);
            }
            catch(err){
                reject(err);
            };
        })
    }


}

module.exports = database;


