function showWorkoutForm() {
	$('#create-workout-button').fadeOut('fast').addClass('hidden');
	$('#find-workout-button').fadeOut('fast').addClass('hidden');
	$('#view-all-workouts-button').fadeOut('fast').addClass('hidden');
	$('#new-workout-section').fadeIn('fast').removeClass('hidden');
}

function watchNewWorkout() {
	$('#create-new-workout-form').off().on('click', '#create-new-workout-button', event => {
		event.preventDefault();
		createNewWorkout();
	});
}

function renderNewWorkout() {
	return `{ 
				"workoutName": "${$('#workout-name').val()}",
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
			watchNewExercise(workout);
			appendNewWorkout(workout);
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

function renderWorkoutRepr(workout) {
	return `<h2>${workout.workoutName}</h2>
				<table class="table">
					<thead>
						<tr>
							<th>Exercise Name</th>
							<th>Sets</th>
							<th>Weight</th>
							<th>Reps</th>
						</tr>
					</thead>
				<tbody id="workout-table-body">
				</tbody>
				</table>`
}

function appendNewWorkout(workout) {
	$('#populate-workout-section').append(renderWorkoutRepr(workout)).fadeIn('fast').removeClass('hidden');
	showExerciseForm();
}

function showExerciseForm() {
	$('#workout-form-container').fadeOut('fast').addClass('hidden');
	$('#workout-exercise-form').fadeIn('fast').removeClass('hidden');
}

function renderNewExercise(workout) {
	return `{ 
				"exerciseName": "${$('#exercise-name').val()}",
				"muscleGroup": "${$('#exercise-muscle-group').val()}",
				"workoutRef": "${workout._id}"
			}`
}

function watchNewExercise(workout) {
	$('#workout-exercise-form').off().on('click', '#add-workout-exercise-button', event => {
		event.preventDefault();
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
			appendNewExercise(exercise);
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

function renderExerciseRepr(exercise) {
	return `<tr>
				<td><strong><em>${exercise.exerciseName}</strong></em></td>
			<tr>`
}

function appendNewExercise(exercise) {
	$('#workout-table-body').append(renderExerciseRepr(exercise)).fadeIn('fast');
}


function clearExerciseForm() {
	$('#exercise-name').val('');
	$('#exercise-muscle-group').val('');
	$('#workout-exercise-form').fadeOut('fast').addClass('hidden');
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

function renderSetsRepr(sets) {
	return `<tr>
				<td></td>
				<td>${sets.setNumber}</td>
				<td>${sets.setWeight}</td>
				<td>${sets.setReps}</td>
			</tr>`
}

function appendNewSet(sets) {
	$('#workout-table-body').append(renderSetsRepr(sets)).fadeIn('fast');
}

function watchSetSubmit(exercise) {
	$('#exercise-sets-form').off().on('click', '#add-set-button', event => {
		event.preventDefault();
		$.ajax({
			method: "POST",
			url: '/api/workouts/sets',
			data: renderNewSets(exercise),
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
			console.log(sets);
			appendNewSet(sets);
			clearSetsForm();
			$('#next-exercise-button').fadeIn('fast').removeClass('hidden');
			addNextExercise();
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

function addNextExercise() {
	$('#workout-exercise-form-container').on('click', '#next-exercise-button', event => {
		event.preventDefault();
		$('#exercise-sets-form').fadeOut('fast').addClass('hidden');
		$('#next-exercise-button').fadeOut('fast').addClass('hidden');
		$('#workout-exercise-form').fadeIn('fast').removeClass('hidden');
	});
}

function clearSetsForm() {
	$('#set-number').val('');
	$('#set-weight').val('');
	$('#set-reps').val('');
}

function handleCreateWorkout() {
	showWorkoutForm();
	watchNewWorkout();
}

$(handleCreateWorkout);
