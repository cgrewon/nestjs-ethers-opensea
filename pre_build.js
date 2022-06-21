var fs = require('fs');
console.log("Incrementing build number...");
fs.readFile('./package.json',function(err,content){
    if(err) throw err;
    var metadata = JSON.parse(content);
    try{
        console.log('Old version number :', metadata.version)
        let numbers = metadata.version.split('.').map(one=>parseInt(one))

        if (numbers.length == 3) {
            numbers[2] += 1;
            metadata.version = numbers.join('.');    
    
            fs.writeFile('./package.json',JSON.stringify(metadata),function(err){
                if(err) throw err;
                console.log("Current build number: " + metadata.version);
            })
        } else {
            console.log('version number is not correct at package.json')
        }
    }catch(ex){
        console.error(ex)
    }
    
    
});