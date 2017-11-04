const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
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
    lastName: {type: String, default: ''}
});

UserSchema.methods.apiRepr = function() {
    return {
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

/////////////////////data///////////////////////

const workoutSchema = mongoose.Schema({	
	date: {type:Date, default: Date.now},
	workoutName: {type: String},
	exercises: {
		exerciseName: {type: String},
		muscleGroup: {type: String},
			sets: {
				number: {type: Number},
				weight: {type: Number},
				notes: {type: String}
		},
	},
});

workoutSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		date: this.date,
		workoutName: this.workoutName,
		exercises: this.exercises
	};
}


const User = mongoose.model('User', UserSchema);
const Workout = mongoose.model('Workout', workoutSchema);

module.exports = {Workout, User};