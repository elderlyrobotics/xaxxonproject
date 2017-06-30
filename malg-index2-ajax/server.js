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
	commandB();
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

// *****************************************
// *****************************************
// *****************************************
//  Communicate with the MALG board

	// include the library SerialPort
var SerialPort = require('serialport'); // make a local instance of it

var myPort = new SerialPort('/dev/ttyUSB2', {
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
	setTimeout(commandReady, 5000);
}

function commandReady(){
	console.log('Ready to receive camera commands: up, down, left, or right.');
}

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
 
function showPortClose() {
	console.log('port closed.');
}
 
function showError(error) {
	console.log('Serial port error: ' + error);
}

