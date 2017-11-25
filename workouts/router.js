'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const uuid = require('uuid');

const {User, Workout, Exercise, Setsobj} = require('../users/models');

const router = express.Router();

const jsonParser = bodyParser.json();

//get protected data for test
router.get(
    '/protected',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        return res.json({
            data: 'protected data'
        });
    }
);

//post for test
router.post('/protected', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
  		Workout
		.create({workoutName: req.body.workoutName,
				userRef: req.body.userRef})
        .then(workout => res.status(201).json(workout))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//delete for test
router.delete('/protected', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Workout
		.findByOneAndRemove(req.params.workoutName)
		.then(() => res.status(204).json({message:'Item Removed'}))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});


//add a new workout
router.post('/new', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Workout
		.create({workoutName: req.body.workoutName,
				userRef: req.body.userRef})
        .then(workout => res.status(201).json(workout))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//add an  exercise to a workout
router.post('/exercises', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Exercise
		.create({exerciseName: req.body.exerciseName,
				muscleGroup: req.body.muscleGroup,
				workoutRef: req.body.workoutRef})
        .then(exercise => res.status(201).json(exercise))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//add a set to an exercise
router.post('/sets', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Setsobj
		.create({setNumber: req.body.setNumber,
				setWeight: req.body.setWeight,
				setReps: req.body.setReps,
				exerciseRef: req.body.exerciseRef})
        .then(Setsobj => res.status(201).json(Setsobj))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//get all workouts for a user
router.get('/myworkouts/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Workout
		.find({userRef: req.params.id})
        .then(workouts => res.json(workouts.map(workout => workout)))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

//find a specific workout by id
router.get('/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Workout
		.findById(req.params.id)
		.then(workout => res.json(workout))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	});

//get all exercises for a workout
router.get('/exercises/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Exercise
		.find({workoutRef: req.params.id})
		.then(exercises => res.json(exercises.map(exercise => exercise)))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	});

//get all sets for an exercise
router.get('/sets/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Setsobj
		.find({exerciseRef: req.params.id})
		.then(setsobjs => res.json(setsobjs.map(setobj => setobj)))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	});

//delete a workout by id
router.delete('/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Workout
		.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).json({message:'Item Removed'}))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	});
//delete an exercise by id
router.delete('/exercises/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Exercise
		.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).json({message:'Item Removed'}))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	});
//delete sets by id
router.delete('/sets/:id', jsonParser,
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Setsobj
		.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).json({message:'Item Removed'}))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	});


module.exports = {router};