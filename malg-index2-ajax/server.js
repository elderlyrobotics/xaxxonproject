var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// var products = [
var commands = [
{
	// id: 1,
	// name: 'laptop'	
	direction: 'up'	
},
{
	direction: 'down'
},
{
	direction: 'left'
},
{
	direction: 'right'
}
];

var PORT = process.env.PORT || 5000;

app.use(express.static(__dirname));
app.use(bodyParser.json());


app.get('/commands', function(req, res) {
	res.send({ commands: commands });
});

app.get('/commandX', function(req, res) {
	commandX();
	res.send('Successfully sent command x!');
});

app.get('/commandB', function(req, res) {
	commandB();
	res.send('Successfully sent command b!');
});

app.get('/commandSTOP', function(req, res) {
	commandSTOP();
	res.send('Successfully sent command STOP!');
});



app.post('/commands', function(req, res) {
    var commandDirection = req.body.name;

    products.push({
        name: commandDirection
    });

    res.send('Successfully created product!');
});


app.listen(PORT, function() {
	console.log('Server listening on ' + PORT);
});






// **********************************************************************************
// **********************************************************************************
//  Communicate with the MALG board

// include the library SerialPort
var SerialPort = require('serialport'); 

//// shows list of ports
// SerialPort.list(function (err, ports) {
// 	ports.forEach(function(port) {
// 		console.log(port.comName);
// 		console.log(port.productId);
// 	});
// });

// sometimes the port number changes when unplugged, 
// e.g. today its at /dev/ttyUSB0 but tomorrow it can be /dev/ttyUSB3
// so if there is an error the incrementUSB() function is called
var USBnumber = 0
// var myPort = new SerialPort('/dev/ttyUSB' + USBnumber, {
var myPort = new SerialPort('/dev/arduino', {
	baudRate: 115200,
    // look for return and newline at the end of each data packet:
    parser: SerialPort.parsers.readline('\r\n')
});	

myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
// myPort.on('error', showError);
myPort.on('error', showError);


function showPortOpen() {
	console.log('port open. Data rate: ' + myPort.options.baudRate);
	setTimeout(commandReady, 2000);

}

function commandReady(){
	console.log('Ready to receive camera commands: up, down, left, or right.');
}

// COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS 
// COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS COMMANDS 
function commandSTOP(){
	myPort.write("s \r");
}

function commandX(){
	myPort.write("x \r");
}

function commandB(){
	myPort.write("b 100 \r");
}

function commandY(){
	myPort.write("y \r");
}

function sendSerialData(data) {
	console.log(data);
}

// default functions
function showPortClose() {
	console.log('port closed.');
}
 
function showError(error) {
	console.log('Serial ' + error);
	// incrementUSB();
}

// function incrementUSB() {
// 	if (USBnumber < 7){		
// 		USBnumber++;
// 		console.log('Now checking: /dev/ttyUSB' + USBnumber);
// 		var myPort = new SerialPort('/dev/ttyUSB' + USBnumber, {
// 			baudRate: 115200,
// 		    // look for return and newline at the end of each data packet:
// 		    parser: SerialPort.parsers.readline('\r\n')
// 		});

// 		myPort.on('open', showPortOpen);
// 		myPort.on('data', sendSerialData);
// 		myPort.on('close', showPortClose);
// 		myPort.on('error', showError);
// 	}
// }


