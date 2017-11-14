const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuid = require('uuid');
mongoose.Promise = global.Promise;

const SetsSchema = mongoose.Schema({
	setNumber: {type: Number, required: true},
	setWeight: {type: Number, required: true},
	setReps: {type: Number, required: true},
	exerciseRef: {type: mongoose.Schema.Types.ObjectId, ref: 'Exercise'}
});

const ExerciseSchema = mongoose.Schema({
	exerciseName: {type: String, required: true},
	muscleGroup: {type:String},
	workoutRef: {type: mongoose.Schema.Types.ObjectId, ref: 'Workout'}
});

const WorkoutSchema = mongoose.Schema({	
	date: {type:Date, default: Date.now},
	workoutName: {type: String, required: true},
	muscleGroup: {type: String, required: true},
	userRef: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

WorkoutSchema.methods.apiRepr = function() {
	return {
			date: this.date,
			workoutName: this.workoutName,
			muscleGroup: this.muscleGroup,
			userRef: this.userRef
	};
};

const UserSchema = mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId},
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
});



UserSchema.methods.apiRepr = function() {
    return {
    	_id: this._id,
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || ''
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);
const Workout = mongoose.model('Workout', WorkoutSchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);
const Sets = mongoose.model('Sets', SetsSchema);
module.exports = {User, Workout, Exercise, Sets};