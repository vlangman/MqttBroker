const Database = require('better-sqlite3');



class database{
    // order of binds for all methods is to be sequential with the query parameters
    // use query STRUCTURE in TABLENAME.QUERYGROUP.QUERY.STRUCTURE to ensure ordering
    static instance;

    getinstance(){
        if (this.instance == null){
            console.log("connecting DB");
            return new Database('gateway.db', { verbose: console.log });
        }
        return this.instance;
    }

    constructor(){}

    get(query, binds){
        return new Promise((resolve, reject)=>{
            try{
                let data = [];
                let smtp = this.getinstance().prepare(query);
                for(const bind in binds)
                    data.push(smtp.get(binds[bind]))
                resolve(data);
            }
            catch(err){
                reject(err);
            };
        })
    }

    getAll(query){
        return new Promise((resolve, reject)=>{
            try{
                let data = [];
                let smtp = this.getinstance().prepare(query);
                resolve(smtp.all());
            }
            catch(err){
                reject(err);
            };
        })
    }

    insertOne(query, binds){
        return new Promise((resolve, reject)=>{
            try{
                const insert = this.getinstance().prepare(query);
                const insertOne = this.getinstance().transaction(([binds]) => {
                    insert.run(binds);
                });
                insertOne(binds);
                resolve(1);
            }
            catch(err){
                reject(err);
            };
        })
    }


     insertMany(query, binds){
        return new Promise((resolve, reject)=>{
            const insert = this.getinstance().prepare(query);
            const insertMany = this.getinstance().transaction((dataarray) => {
                for (const binds of dataarray){
                    insert.run(binds);
                };
            });
            try{
                insertMany(binds);
                resolve(true);
            }
            catch(err){
                reject(err);
            };
        })
    }

     getMany(query, binds){
        return new Promise((resolve, reject)=>{
            result = [];
            const insert = this.getinstance().prepare(query);
            const insertMany = this.getinstance().transaction((dataarray) => {
                for (const binds of dataarray){
                    console.log(binds)
                    result += insert.get(binds);
                };
            });
            try{
                insertMany(binds);
                resolve(result);
            }
            catch(err){
                reject(err);
            };
        })
    }


    close(){
        if (this.instance != null)
        {
            console.log("SHUTTING DOWN DB CONN");
            this.instance.close();
        }
    }

}

module.exports = database;


