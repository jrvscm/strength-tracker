const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuid = require('uuid');
mongoose.Promise = global.Promise;

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
    workouts: Array
});

UserSchema.methods.apiRepr = function() {
    return {
    	userID: this.userID,
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        workouts: this.workouts
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
	workoutName: {type: String, required: true},
	exercises: Array
	//"muscleGroup": type: String,
	//"exerciseName": type: String
	//"sets": [
	//"setNumber": type: number,
	//"setWeight": type: number,
	//"setReps": type: number,
	//"setNotes": type: string	
	//]	
});

const User = mongoose.model('User', UserSchema);
module.exports = {User};