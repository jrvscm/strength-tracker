require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const uuid = require('uuid');

const {router: usersRouter} = require('./users');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');

mongoose.Promise = global.Promise;

const{PORT, DATABASE_URL} = require('./config');

const {User} = require('./users/models');

const app = express();

//logging
app.use(morgan('common'));

//CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if (req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

app.use(bodyParser.json());

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

//A protected endpoint which needs a valid JWT to access it
app.get(
	'/api/protected',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		return res.json({
			data: 'tester'
		});
	}
);

//protected - add a workout
app.put('/api/workouts',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
	User
	.findOneAndUpdate({userID: req.body.userID}, 
		{$push: {workouts: req.body.workout}, new: true})
	.then(updatedWorkout => res.status(204).end())
	.catch(err => res.status(500).json({message: `Something went wrong`}));
});

//protected - add an exercise to a workout
app.put('/api/workouts/exercises',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
	User
	.findOneAndUpdate({userID: req.body.userID}, 
		{$push: {exercises: req.body.exercise}, new: true})
	.then(updatedWorkout => res.status(204).end())
	.catch(err => res.status(500).json({message: `Something went wrong`}));
});


app.use('*', (req, res) => {
	return res.status(404).json({message: 'Not Found'});
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