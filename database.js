const Database = require('better-sqlite3');
const fs = require('fs');


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

    constructor(){
    }

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


     ExecuteStatement(query, binds){
        return new Promise((resolve, reject)=>{
            try{
                const insert = this.getinstance().prepare(query);
                const ExecuteStatement = this.getinstance().transaction((dataarray) => {
                    let info = []
                    for (const binds of dataarray){
                        info.push(insert.run(binds));
                    };
                    return info;
                });
                resolve(ExecuteStatement(binds));
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

    //warning only run when you wish to recreate the tables THIS WILL WIPE ALL DATA EXCEPT BACKUPS
    resetDB(){
        const reset = fs.readFileSync('./init_database.sql', 'utf8');
        this.getinstance().exec(reset);
    }

}

module.exports = database;


