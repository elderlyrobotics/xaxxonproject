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