const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const uuid = require('uuid');

const {User, Workout, Exercise, Sets} = require('../users/models');


const router = express.Router();

const jsonParser = bodyParser.json();

// add a workout
router.put('/news', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		User.findOneAndUpdate(
			{username: req.body.username},
			{$push: {workouts: req.body.workout}}, 
			{upsert:true, new:true})
        .then(user => res.json(user.apiRepr()))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//add an exercise
router.put('/exercisess', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		User.findOneAndUpdate(
			{username: req.body.username, 'workouts._id': req.body._id},
			{$push: {'workouts.$.exercises': req.body.exercise}},
			{upsert: true, new: true})
		.then(user => res.json(user.apiRepr()))
    	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

//add a new workout
router.post('/newref', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Workout
		.create({workoutName: req.body.workoutName,
				muscleGroup: req.body.muscleGroup,
				userRef: req.body.userRef})
        .then(user => res.json(workout.apiRepr()))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});
module.exports = {router};