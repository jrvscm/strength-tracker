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
			watchExerciseMuscleGroup();
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

function watchExerciseMuscleGroup() {
	$('#workout-exercise-form').on('click', '#exercise-muscle-group', event => {
		$('#muscle-group').toggleClass('hidden');
	});

	watchMuscleGroupLiClicks();
}

function watchMuscleGroupLiClicks() {
$('#muscle-group').off().on('click', '.createWorkoutLi', function(e) {
        $('#exercise-muscle-group').val($(e.target).text());
        $('#muscle-group').toggleClass('hidden');
    });
	

	watchMuscleGroupValue();//--> dropdown.js
}

function watchExerciseLiClicks() {
	$('#exercise').off().on('click', '.createWorkoutLi', function(e) {
        $('#exercise-name').val($(e.target).text());
        $('#exercise').toggleClass('hidden');
    });

    renderExerciseSetsForm();
}

function renderExerciseSetsForm() {
	$('#workout-exercise-form-container').on('click', '#set-number', event => {
		$('#set-numbers-list').empty();
		for (let i=1; i<=15; i++) {
			$('#set-numbers-list').append(`<li class="createWorkoutLi set-number-li">${i}</li>`);
		}
		$('#set-numbers-list').toggleClass('hidden');
	});
	pickSetNumber();
} 

function pickSetNumber() {
	$('#workout-exercise-form-container').on('click', '.set-number-li', function(e) {
        $('#set-number').val($(e.target).text());
        $('#set-numbers-list').toggleClass('hidden');
    });
	renderSetWeightDropdown();
}

function renderSetWeightDropdown() {
	$('#workout-exercise-form-container').on('click', '#set-weight', event => {
		$('set-weight-list').empty();
		for (let i=5; i<=1000; i+=5) {
			$('#set-weight-list').append(`<li class="createWorkoutLi set-weight-li">${i}</li>`);
		}
		$('#set-weight-list').toggleClass('hidden');
	});
	pickSetWeight();
} 

function pickSetWeight() {
	$('#workout-exercise-form-container').on('click', '.set-weight-li', function(e) {
        $('#set-weight').val($(e.target).text());
        $('#set-weight-list').toggleClass('hidden');
    });
	renderSetRepsDropdown();
}


function renderSetRepsDropdown() {
	$('#workout-exercise-form-container').on('click', '#set-reps', event => {
		$('#set-reps-list').empty();
		for (let i=1; i<=50; i++) {
			$('#set-reps-list').append(`<li class="createWorkoutLi set-reps-li">${i}</li>`);
		}
		$('#set-reps-list').toggleClass('hidden');
	});
	pickSetReps();
}

function pickSetReps() {
	$('#workout-exercise-form-container').on('click', '.set-reps-li', function(e) {
        $('#set-reps').val($(e.target).text());
        $('#set-reps-list').toggleClass('hidden');
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
				</table>`;
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
	return `<tr class="exercise-info">
				<td><strong><em>${exercise.exerciseName}</strong></em></td>
			</tr>`;
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
	setTimeout(function() {
		$('#exercise-sets-form').fadeIn('fast').removeClass('hidden');
	watchSetSubmit(exercise)
	},200);
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
	return `<tr class="set-info">
				<td></td>
				<td>${sets.setNumber}</td>
				<td>${sets.setWeight}</td>
				<td>${sets.setReps}</td>
			</tr>`;
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
		setTimeout(function() {
			$('#workout-exercise-form').fadeIn('fast').removeClass('hidden');
		}, 200);
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
