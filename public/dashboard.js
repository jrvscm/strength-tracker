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
			'exercises': []
		}
		}),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(data) {
			console.log(data);	
		},
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
		},
	});
	showExerciseForm()
}

function showExerciseForm() {
	$('#new-workout-section').fadeOut('fast').addClass('hidden');
	setTimeout(function() {
	$('#add-exercise-section').fadeIn('fast').removeClass('hidden');
}, 250);
	watchNewExercise();
}

function watchNewExercise() {
	$('#workout-exercise-form').on('click', '#add-workout-exercise-button', event => {
		event.preventDefault();
		let exerciseName = $('#exercise-name');
		localStorage.setItem("exerciseName", exerciseName.val());
		
		let exMuscleGroup = $('#exercise-muscle-group');
		localStorage.setItem("exMuscleGroup", exMuscleGroup.val());
		addExercise();
	});
}

function addExercise() {
	$.ajax({
		method: "PUT",
		url: '/api/workouts/exercises',
		data: JSON.stringify({
			'username': `${localStorage.getItem('username')}`,
			'exercise': {
			'exerciseName': `${localStorage.getItem('exerciseName')}`,
			'exMuscleGroup': `${localStorage.getItem('exMuscleGroup')}`,
			'sets': []
		}
		}),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(data) {
			console.log(data);	
		},
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
		},
	});
}

function clearExerciseFields() {
	$('#exercise-name').val('');
	$('#exercise-muscle-group').val('');
}

function clearWorkoutFields() {
	$('#workout-muscle-group').val('');
	$('#workout-name').val('');
}

function watchAddExerciseBtn() {
	$('#workout-choices-list').on('click', '#create-workout-button', event => {
		showWorkoutForm();
	});
}


$(watchCreateWorkoutBtn);