
// ---------- Connection with aws-iot ------------
// this change i have to project it only in twowire-deviceshadows branch
var awsIot = require('aws-iot-device-sdk')
const thingName = "twowire"

var device = awsIot.device({
    keyPath:'E://node-course//notes-app//twowire/private.pem.key',
    certPath:'E://node-course//notes-app//twowire/certificate.pem.crt',
    caPath:'E://node-course//notes-app//twowire/AmazonRootCA1.pem',
    clientId:thingName,
    host:'a3hh7qkacgcaqh-ats.iot.us-east-1.amazonaws.com'
    
})

device.on("connect",function(){
    console.log("AWS IoT Connected");
});

var thingShadow = awsIot.thingShadow({
    keyPath:'E://node-course//notes-app//twowire/private.pem.key',
    certPath:'E://node-course//notes-app//twowire/certificate.pem.crt',
    caPath:'E://node-course//notes-app//twowire/AmazonRootCA1.pem',
    clientId:thingName,
    host:'a3hh7qkacgcaqh-ats.iot.us-east-1.amazonaws.com'
})


const operationTimeout = 10000;

var currentTimeout = null;
var state = 0;

var stack = [];

function genericOperation(operation, state) {
    
    var clientToken = thingShadow[operation](thingName, state);
    console.log(clientToken)
    if (clientToken === null) {
        //
        // The thing shadow operation can't be performed because another one
        // is pending; if no other operation is pending, reschedule it after an 
        // interval which is greater than the thing shadow operation timeout.
        //
        if (currentTimeout !== null) {
        console.log('operation in progress, scheduling retry...');
        currentTimeout = setTimeout(
            function() {
                genericOperation(operation, state);
            },
            operationTimeout * 2);
        }
    } else {
        //
        // Save the client token so that we know when the operation completes.
        //
        stack.push(clientToken);
    }
}

// function generateRandomState() {
//     var rgbValues = {
//        red: 0,
//        green: 0,
//        blue: 0
//     };

//     rgbValues.red = Math.floor(Math.random() * 255);
//     rgbValues.green = Math.floor(Math.random() * 255);
//     rgbValues.blue = Math.floor(Math.random() * 255);

//     return {
//        state: {
//           desired: rgbValues
//        }
//     };
//  };


    const rgbValues = {
    state: {
                  desired: {
                      "red":24,
                      "green":03,
                      blue:22
                  }
               }
}




function deviceConnect() {
    console.log("Eneterd Device Connect")
   
    thingShadow.on('connect', function() {
        console.log('connected to AWS IoT');
        thingShadow.register( thingName, {}, function() {
            console.log('Device thing registered.');
            // if(state==0){
            // genericOperation('update',generateRandomState());
            // state=state+1;
            // }
            // else{
            //     genericOperation('update',rgbValues);
            // }
         
            genericOperation('update',generateRandomState());
        });
    });
}
deviceConnect();
