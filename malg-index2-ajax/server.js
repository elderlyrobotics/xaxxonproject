var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var joinPath = require('path.join');

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

// Bower static path for jQuery and Bootstrap
app.use(express.static(joinPath(__dirname, 'bower_components')));
app.use(express.static(__dirname));
app.use(bodyParser.json());


app.get('/commands', function(req, res) {
	res.send({ commands: commands });
});

app.get('/commandX', function(req, res) {
	commandX();
	res.send('Successfully sent command x!');
});

app.get('/commanda20', function(req, res) {
	commanda20();
	res.send('Successfully sent command a20!');
});

app.get('/commandb20', function(req, res) {
	commandb20();
	res.send('Successfully sent command b20!');
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
myPort.on('error', showError);


function showPortOpen() {
	console.log('port open. Data rate: ' + myPort.options.baudRate);
	setTimeout(commandReady, 10000);

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

function commanda20(){
	myPort.write("a20 \r");
}

function commandb20(){
	myPort.write("b20 \r");
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


