const mongoose = require('mongoose');
const uuid = require('uuid');

mongoose.Promise = global.Promise;

const WorkoutSchema = mongoose.Schema({	
	date: {type:Date, default: Date.now},
	workoutName: {type: String, required: true},
	exercises: Array,	
});

WorkoutSchema.methods.apiRepr = function() {
	return {
		date: this.date,
		workoutName: this.workoutName,
		exercises: this.exercises
	}
}

const Workout = mongoose.model('Workout', WorkoutSchema);
module.exports = {Workout};