/* 
**********************************************************************************
	Setting up the server
**********************************************************************************
*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var joinPath = require('path.join');

/*
	sets the port number of web app -> IPADDRESS:PORT
	we are using 5000 -> localhost:5000
*/
var PORT = process.env.PORT || 5000;

/*
	Bower static path for jQuery and Bootstrap
	bodyParser is an artefact from old tutorial this server was based on
*/
app.use(express.static(joinPath(__dirname, 'bower_components')));
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.listen(PORT, function() {
	console.log('Server listening on ' + PORT);
});

/* 
**********************************************************************************
	Routes - for GET requests
**********************************************************************************
*/
// sending 'x' is set to show MALG ID
app.get('/commandX', function(req, res) {
	commandX();
	res.send('Successfully sent command x!');
});

app.get('/commandStop', function(req, res) {
	commandStop();
	res.send('Successfully sent command STOP!');
});

app.get('/commandUp', function(req, res) {
	commandUp();
	res.send('Successfully sent command Up!');
});

app.get('/commandDown', function(req, res) {
	commandDown();
	res.send('Successfully sent command Down!');
});

app.get('/commandLeft', function(req, res) {
	commandLeft();
	res.send('Successfully sent command Left!');
});

app.get('/commandRight', function(req, res) {
	commandRight();
	res.send('Successfully sent command Right!');
});

/* 
**********************************************************************************
	Communication with the MALG board - setting up SerialPort
**********************************************************************************
*/
// include the library SerialPort
var SerialPort = require('serialport'); 

/*
	sometimes the port number changes when unplugged, 
	e.g. today its at /dev/ttyUSB0 but tomorrow it can be /dev/ttyUSB3
	so if there is an error the incrementUSB() function is called
*/
var myPort = new SerialPort('/dev/arduino', {
	baudRate: 115200,
    // look for return and newline at the end of each data packet:
    parser: SerialPort.parsers.readline('\r\n')
});	

myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

// serial events default functions
function sendSerialData(data) {
	console.log(data);
}

function showPortClose() {
	console.log('port closed.');
}
 
function showError(error) {
	console.log('Serial ' + error);
}

/* 
**********************************************************************************
	Communication with the MALG board - commands
**********************************************************************************
*/

function showPortOpen() {
	console.log('port open. Data rate: ' + myPort.options.baudRate);
	setTimeout(commandReady, 10000);
}


var tilt = 0;
var pan = 0;
function commandReady(){
	console.log('Ready to receive camera commands: up, down, left, or right.');
	tilt = tilt + 65;
	myPort.write("A" + tilt + " \r");
	pan = pan + 150;
	myPort.write("B" + pan + " \r");
}

function commandStop(){
	myPort.write("s \r");
	myPort.write("S \r");
}

function commandX(){
	myPort.write("x \r");
}

function commandUp(){
	tilt = tilt + 5;
	console.log('tilt value: ' + tilt);
	myPort.write("A" + tilt + " \r");
}

function commandDown(){
	tilt = tilt - 5;
	console.log('tilt value: ' + tilt);
	myPort.write("A" + tilt + " \r");
}

function commandLeft(){
	if (tilt >= 50) {
		pan = pan;
	}else{
		pan = pan + 50
	}
	console.log('pan value: ' + pan);
	myPort.write("B" + pan + " \r");
}

function commandRight(){
	if (tilt >= 50) {
		pan = pan;
	}else{
		pan = pan - 50
	}
	console.log('pan value: ' + pan);
	myPort.write("B" + pan + " \r");
}

