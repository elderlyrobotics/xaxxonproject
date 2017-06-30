var // include the library
   SerialPort = require('serialport'); // make a local instance of it
   // get port name from the command line:
  // portName = process.argv[2];
  command = process.argv[2];
  value = process.argv[3];

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
   // myPort.write("x \r");
   console.log("The command you sent was: " + command);
   console.log("The value you sent was: " + value);
   setTimeout(test, 5000);
   // myPort.write(command + " \r");
   // myPort.write("y \r");
}

function test(){
	// myPort.write(command + " \r");
	// myPort.write("l \r");
	myPort.write(command + " " + value + " \r");
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

