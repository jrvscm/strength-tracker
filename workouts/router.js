const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const uuid = require('uuid');

const {User, Workout, Exercise, Sets} = require('../users/models');


const router = express.Router();

const jsonParser = bodyParser.json();

// add a workout
router.put('/new', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
	User.findOneAndUpdate({username: req.body.username},
		{$push: {workouts: req.body.workout}, upsert:true, new: true})
        .then(user => res.json(user.apiRepr()))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//add an exercise
router.put('/exercisess', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
	User.findOne({'workouts._id': req.body._id})
	.then(function(user) {
		let workoutsList = user.workouts;
		for(let i=0; i<workoutsList.length; i++) {
			for(let j=0; j<workoutsList[i].length; i++){
				console.log(workoutsList[i][j])
			}
		}
		res.json(workoutsList);
	})
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.put('/exercises', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		User.findOne({'workouts._id': req.body._id})
		.then(function(user) {
		let subWorkout = user.workouts.id("5a07a9e0d1eebc53086ee100");
		subWorkout.exercises.push(req.body.exercise);
		res.json(subWorkout);
	})
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = {router};