function watchCreateWorkoutBtn() {
	$('#workout-choices-list').on('click', '#create-workout-button', event => {
		showWorkoutForm();
	});
}

function showWorkoutForm() {
	$('#find-workout-button').fadeOut('fast').addClass('hidden');
	$('#view-all-workouts-button').fadeOut('fast').addClass('hidden');
	$('#new-workout-section').fadeIn('fast').removeClass('hidden');
	watchNewWorkout()
}

function watchNewWorkout() {
	$('#create-new-workout-form').on('click', '#create-new-workout-button', event => {
		event.preventDefault();
		let workoutName = $('#workout-name');
		localStorage.setItem("workoutName", workoutName.val());
		
		let muscleGroup = $('#workout-muscle-group');
		localStorage.setItem("muscleGroup", muscleGroup.val());
		createNewWorkout();
	});
}

function createNewWorkout() {
	$.ajax({
		method: "PUT",
		url: '/api/workouts/new',
		data: JSON.stringify({
			'username': `${localStorage.getItem('username')}`,
			'workout': {
			'workoutName': `${localStorage.getItem('workoutName')}`,
			'muscleGroup': `${localStorage.getItem('muscleGroup')}`,
		}
		}),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(user) {
			accessUserObject(user);
		},
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
		},
	});
	showExerciseForm()
}

function accessUserObject(user) {
	getCurrentWorkoutId(user);
}

function getCurrentWorkoutId(user) {
	let idx = user.workouts.length - 1;
	localStorage.setItem('currentWorkout', user.workouts[idx]._id);
}

function showExerciseForm() {
	$('#new-workout-section').fadeOut('fast').addClass('hidden');
	setTimeout(function() {
	$('#add-exercise-section').fadeIn('fast').removeClass('hidden');
}, 250);
	renderWorkoutDisplay();
	watchNewExercise();
}

function watchNewExercise() {
	$('#workout-exercise-form').on('click', '#add-workout-exercise-button', event => {
		event.preventDefault();
		let exerciseName = $('#exercise-name');
		localStorage.setItem("exerciseName", exerciseName.val());
		
		let exMuscleGroup = $('#exercise-muscle-group');
		localStorage.setItem("exMuscleGroup", exMuscleGroup.val());

		let exSetNumber = $('#set-number');
		localStorage.setItem("setNumber", exSetNumber.val());

		let exSetWeight = $('#set-weight');
		localStorage.setItem("setWeight", exSetWeight.val());

		let exSetReps = $('#set-reps');
		localStorage.setItem("setReps", exSetReps.val());

		addExercise();
	});
}

function addExercise() {
	$.ajax({
		method: "PUT",
		url: '/api/workouts/exercises',
		data: JSON.stringify({
			'username': `${localStorage.getItem('username')}`,
			'_id': `${localStorage.getItem('currentWorkout')}`,
			'exercise': {
			'exerciseName': `${localStorage.getItem('exerciseName')}`,
			'muscleGroup': `${localStorage.getItem('muscleGroup')}`,
			'sets': [
			{'setNumber': `${localStorage.getItem('setNumber')}`,
			 'setReps': `${localStorage.getItem('setReps')}`,
			 'setWeight': `${localStorage.getItem('setWeight')}`
			}]
		}
	}),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(data) {
			console.log(data);	
		},
		error: function(xhr, status, error) {
  			var err = eval("(" + xhr.responseText + ")");
  			alert(err.Message);
		},
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
		},
	});
}

function renderWorkoutDisplay() {
	let workoutRep = `<div class="workout">
								<h2>Workout: ${localStorage.getItem('workoutName')}</h2>
								<h3>Muscle Group: ${localStorage.getItem('muscleGroup')}</h3>
								<h3>Exercises: </h3>
					  </div>`;
	insertWorkout(workoutRep);
}

function insertWorkout(workoutRep) {
	$('#populate-workout-section').append(workoutRep).fadeIn('fast').removeClass('hidden');
}

function clearExerciseFields() {
	$('#exercise-name').val('');
	$('#exercise-muscle-group').val('');
}

function clearWorkoutFields() {
	$('#workout-muscle-group').val('');
	$('#workout-name').val('');
}

function watchLogOut() {
	$('#workout-choices-list').on('click', '#log-out-button', event => {
		localStorage.clear();
		window.location.href = 'index.html';
	});
}

function handleUserPaths() {
	watchCreateWorkoutBtn()
	watchLogOut()
}

$(handleUserPaths);