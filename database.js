const Database = require('better-sqlite3');



class database{

    //order of binds for all methods is to be sequential with the query parameters

    instance = null

    constructor(){
        this.instance = new Database('gateway.db', { verbose: console.log });
    }


    async insertOne(query, binds){
        return new Promise((resolve, reject)=>{
            const insert = this.instance.prepare(query);

            const insertOne = this.instance.transaction(([binds]) => {
                insert.run(binds);
            });

            insertOne(binds).then(()=>{
                resolve(1);
            }).catch((err)=>{
                reject(err);
            });

        })
    }


    async insertMany(query, binds){
        return new Promise((resolve, reject)=>{
            const insert = this.instance.prepare(query);

            const insertMany = this.instance.transaction((dataarray) => {
                for (const binds of dataarray){
                    console.log(Object.values(binds))
                    insert.run(Object.values(binds));
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


