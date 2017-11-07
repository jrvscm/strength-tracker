const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const{PORT, DATABASE_URL} = require('./config');
const{Workout} = require('./users/models');

const app = express();

//logging
app.use(morgan('common'));

//app.use(express.static('public'));

app.use(bodyParser.json());

//app.get('/', (req, res) => {
	//res.sendFile(__dirname + '/public/index.html');
//}


app.get('/workouts', (req, res) => {
	Workout
	.find()
	.then(workouts => {
		res.json(workouts.map(workout => workout.apiRepr()));
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Something went terribly wrong'});
	});
});

app.get('/workouts/:id', (req, res) => {
	Workout
	.findById(req.params.id)
	.then(workout => res.json(workout.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({ error: 'Something went terribly wrong'});
	});
});

app.put('/workouts/:id/exercises', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: `Request path id and request body id values must match`
		});
	}
	const newExercise = {};
	const fields = ['exerciseName','muscleGroup'];
	fields.forEach(field => {
		if(field in req.body) {
			newExercise[field] = req.body[field];
		}
	});

	Workout
	.findByIdAndUpdate(req.params.id, 
		{$push: {exercises: newExercise}, new: true})
	.then(updatedWorkout => res.status(204).end())
	.catch(err => res.status(500).json({message: `Something went wrong`}));
});

app.put('/workouts/:id/exercises/sets', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: `Request path id and request body id values must match`
		});
	}
	const newSet = {};
	const fields = ['setNumber','setWeight', 'setReps', 'setNotes'];
	fields.forEach(field => {
		if(field in req.body) {
			newSet[field] = req.body[field];
		}
	});


	Workout
	.findOneAndUpdate({_id: req.params.id, 'exercises.exerciseID': req.body.exerciseID}, 
            {$push: {'exercises.sets': req.body.sets}}, 
            {new: true})
        .then(exercise => {
        	console.log(exercise)
		res.status(200).json({exercise})
		})
        .catch(err => {
        console.log(err)
        res.status(500)
    });

});


app.post('/workouts', (req, res) => {
	const requiredFields = ['workoutName'];
	for(let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	Workout
	.create({
		workoutName: req.body.workoutName,
		exercises: req.body.exercises
	})
	.then(Workout => res.status(201).json(Workout.apiRepr()))
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Something went wrong'});
	});
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