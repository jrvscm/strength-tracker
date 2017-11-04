const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const{PORT, DATABASE_URL} = require('./config');
const{User, Workout} = require('./users');

const app = express();

//logging
app.use(morgan('common'));

//app.use(express.static('public'));

app.use(bodyParser.json());

//app.get('/', (req, res) => {
	//res.sendFile(__dirname + '/public/index.html');
//}


app.get('/test', (req, res) => {
		res.json(
			'hello turds'
		);
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if(err) {
				return reject(err);
			}
			server = app.listen(port,() => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if(err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};