var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);
//process.env.DEV_ENV = true;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);


if(process.env.DEV_ENV){
    mongoose.connect('mongodb://localhost/tutorial', function(err){
		if(err){
			console.log('NOT connected to MongoDB' + err);
		}
		else{
			console.log('Succesfully connected to MongoDB');
		}
	});
}
else{
    mongoose.connect('mongodb://vatsal:vatsal1@ds215961.mlab.com:15961/meantutorialapp', function(err){
		if(err){
			console.log('NOT connected to mLab MongoDB' + err);
		}
		else{
			console.log('Succesfully connected to mLab MongoDB');
		}
	});
}



app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(){
	console.log('Running the server on port ' + port);
});