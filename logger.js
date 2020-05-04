
const recursiveObjPrint = (obj)=>{
    if (typeof obj === 'object')
    {
        for(const key in obj){
            if (obj[key]!=null){
                console.log(`${key} : ${recursiveObjPrint(obj[key])}`);
            }else{
                console.log("BOTTOM: "+ obj)
            }
        }
    }
    else{
        return obj;
    }
}

module.exports.logError = (err, callingFunctionInfo, params = null, logToFile = false)=>{
    console.log(`---------------------ERROR IN: ${callingFunctionInfo.name}------------------------\n\n`)
    console.log(err.message + '\n');
    console.log(err.stack + '\n');

    if (params != null){
        console.log("================Additional paramters Passed==================" + '\n');
        for (const idx in params) {

            console.log(`Argument ${idx}:\n`);
            console.log(recursiveObjPrint(params[idx]));
            console.log(`\n`);
        }
        console.log("=============================================================="+'\n');
    }
    console.log(`-------------------------------ERROR END-----------------------------------------\n\n`)

}
