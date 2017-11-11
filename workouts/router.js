const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const uuid = require('uuid');

const {Workout} = require('./models');
const {User} = require('../users/models');


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



module.exports = {router};