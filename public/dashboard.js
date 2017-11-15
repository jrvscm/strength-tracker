function watchCreateWorkoutBtn() {
	$('#workout-choices-list').on('click', '#create-workout-button', event => {
		showWorkoutForm();
		getUserId();
	});
}

function showWorkoutForm() {
	$('#find-workout-button').fadeOut('fast').addClass('hidden');
	$('#view-all-workouts-button').fadeOut('fast').addClass('hidden');
	$('#new-workout-section').fadeIn('fast').removeClass('hidden');
}

function watchNewWorkout() {
	$('#create-new-workout-form').on('click', '#create-new-workout-button', event => {
		event.preventDefault();
		createNewWorkout();
	});
}

function getUserId() {
	$.ajax({
		method: "POST",
		url: '/api/users/params',
		data: JSON.stringify({
			'username': `${localStorage.getItem('username')}`,
		}),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(user) {
			localStorage.setItem('userId', user._id);
			watchNewWorkout();
		},
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
		},
		error: function(xhr, status, error) {
  			let err = eval("(" + xhr.responseText + ")");
  			alert(err.Message);
		}
	});
}

function renderNewWorkout() {
	return `{ 
				"workoutName": "${$('#workout-name').val()}",
				"muscleGroup": "${$('#workout-muscle-group').val()}",
				"userRef": "${localStorage.getItem('userId')}"	
			}`
}

function createNewWorkout() {
	$.ajax({
		method: "POST",
		url: '/api/workouts/new',
		data: renderNewWorkout(),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(workout) {
			console.log(workout);
			showExerciseForm();
			watchNewExercise(workout);
		},
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
		},
		error: function(xhr, status, error) {
  			let err = eval("(" + xhr.responseText + ")");
  			alert(err.Message);
		}
	});
}

function showExerciseForm() {
	$('#new-workout-section').fadeOut('fast').addClass('hidden');
	setTimeout(function() {
	$('#add-exercise-section').fadeIn('fast').removeClass('hidden');
}, 250);
}

function renderNewExercise(workout) {
	return `{ 
				"exerciseName": "${$('#exercise-name').val()}",
				"muscleGroup": "${$('#exercise-muscle-group').val()}",
				"workoutRef": "${workout._id}"
			}`
}

function watchNewExercise(workout) {
	$('#workout-exercise-form').on('click', '#add-workout-exercise-button', event => {
		event.preventDefault();
		console.log('clickedexecise')
		$.ajax({
			method: "POST",
			url: '/api/workouts/exercises',
			data: renderNewExercise(workout),
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(exercise) {
			console.log(exercise);
			clearExerciseForm();
			showSetsForm(exercise);
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  					let err = eval("(" + xhr.responseText + ")");
  					alert(err.Message);
				}
			});
		});
}

function clearExerciseForm() {
	$('#exercise-name').val('');
	$('#exercise-muscle-group').val('');
}

function showSetsForm(exercise) {
	$('#exercise-sets-form').fadeIn('fast').removeClass('hidden');
	watchSetSubmit(exercise)
}

function renderNewSets(exercise) {
	return `{ 
				"setNumber": "${$('#set-number').val()}",
				"setWeight": "${$('#set-weight').val()}",
				"setReps": "${$('#set-reps').val()}",
				"exerciseRef": "${exercise._id}"
			}`
}

function watchSetSubmit(exercise) {
	$('#exercise-sets-form').on('click', '#add-set-button', event => {
		event.preventDefault();
		$.ajax({
			method: "POST",
			url: '/api/workouts/sets',
			data: renderNewSets(exercise),
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
			console.log(sets);
			clearSetsForm();
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  					let err = eval("(" + xhr.responseText + ")");
  					alert(err.Message);
				}
			});
		});
}

function clearSetsForm() {
	$('#set-number').val('');
	$('#set-weight').val('');
	$('#set-reps').val('');
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