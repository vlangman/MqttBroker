

module.exports.logError = (err, callingFunctionInfo, params = null, logToFile = false)=>{
    console.log(`---------------------ERROR IN: ${callingFunctionInfo.name}------------------------\n\n`)
    console.log("Parent trace : " + callingFunctionInfo.caller.name + '\n');
    console.log(err.message + '\n');
    console.log(error.stack + '\n');

    if (params != null){
        console.log("================Additional paramters Passed==================" + '\n');
        console.log(params + '\n');
        console.log("=============================================================="+'\n');
    }
    console.log(`-------------------------------------------------------------------------\n\n`)

}