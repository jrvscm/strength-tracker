const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuid = require('uuid');
mongoose.Promise = global.Promise;

const SetsSchema = mongoose.Schema({
	setNumber: {type: Number, required: true},
	setWeight: {type: Number, required: true},
	setReps: {type: Number, required: true},
	setNotes: {type: String}
})

const ExerciseSchema = mongoose.Schema({
	exerciseName: {type: String, required: true},
	muscleGroup: {type:String},
	sets: [SetsSchema]
})

const WorkoutSchema = mongoose.Schema({	
	date: {type:Date, default: Date.now},
	workoutName: {type: String, required: true},
	muscleGroup: {type: String},
	exercises: [ExerciseSchema]	
});

const UserSchema = mongoose.Schema({
	userID: String,
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
    workouts: [WorkoutSchema]
});



UserSchema.methods.apiRepr = function() {
    return {
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        workouts: this.workouts || ''
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