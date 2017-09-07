/* 
**********************************************************************************
	Setting up the server
**********************************************************************************
*/

var express = require('express');
var app = express();
var joinPath = require('path.join');
var bodyParser = require('body-parser');
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
// include the library SerialPort and bodyparser
var SerialPort = require('serialport'); 
/*
	sometimes the port number changes when unplugged, 
	e.g. today its at /dev/ttyUSB0 but tomorrow it can be /dev/ttyUSB3
	so if there is an error the incrementUSB() function is called
*/
var myPort = new SerialPort('/dev/arduino', {
	baudRate: 115200//,
    // look for return and newline at the end of each data packet:
    //parser: SerialPort.parsers.readline('\r\n')
});	

myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

// serial events default functions
function sendSerialData(data) {
	console.log(data.toString());
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
var tilt = 0;
var pan = 0;

function showPortOpen() {
	console.log('port open. Data rate: ' + myPort.options.baudRate);
	setTimeout(commandReady, 7000);
}

function commandReady(){
	console.log('Ready to receive camera commands: up, down, left, or right.');
	setTimeout(commandReadyTilt, 1000);
}

function commandReadyTilt(){
	tilt = tilt + 50;
	test = "a" + tilt + "\r";
	console.log("test value: " + test);
	myPort.write(test);
	setTimeout(commandReadyPan, 1000);
}

function commandReadyPan(){
	pan = pan + 125;
	test222 = "b" + pan + "\r";
	console.log("test222 value: " + test222);
	myPort.write(test222);
}


function commandStop(){
	myPort.write("s\r");
	myPort.write("S\r");
}

function commandX(){
	myPort.write("x");
}

function commandUp(){
	tilt = tilt - 10;
	console.log('tilt value: ' + tilt);
	myPort.write("a" + tilt + "\r");
	// if too many clicks up we need the tilt value to be positive
	if (tilt <= 0){
		tilt = 10;
	}
}
//test
function commandDown(){
	if (tilt >= 100) {
		tilt = tilt;
		console.log('Tilting down too much.');
	}
	tilt = tilt + 10;	
	console.log('tilt value: ' + tilt);
	myPort.write("a" + tilt + "\r");
}

function commandLeft(){
	if (tilt >= 100) {
		pan = pan;
		console.log('Tilt value too much to turn.');
	}else if (pan >= 300){
		pan = pan;
		console.log('Panning to the left too much.');
	}else{
		pan = pan + 25;
	}
	console.log('pan value: ' + pan);
	myPort.write("b" + pan + "\r");
}

function commandRight(){
	if (tilt >= 100) {
		pan = pan;
		console.log('Tilt value too much to turn.');
	}else{
		pan = pan - 25;
	}
	console.log('pan value: ' + pan);
	myPort.write("b" + pan + "\r");
	// if too many clicks to the right we need the pan value to be positive
	if (pan <= 0){
		pan = 25;
	}
}

