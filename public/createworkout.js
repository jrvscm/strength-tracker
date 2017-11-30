

function showWorkoutForm() {
	$('#create-workout-button').fadeOut('fast').addClass('hidden');
	$('#find-workout-button').fadeOut('fast').addClass('hidden');
	$('#view-all-workouts-button').fadeOut('fast').addClass('hidden');
	$('#new-workout-section').fadeIn('fast').removeClass('hidden');
}

function watchNewWorkout() {
	$('#create-new-workout-form').off().on('click', '#create-new-workout-button', event => {
		event.preventDefault();
		if($('#create-new-workout-form').valid()) {
		createNewWorkout();
		watchEndWorkout();
		}
	});
}

function watchEndWorkout() {
	$('#finish-workout-button').fadeIn('fast').toggleClass('hidden');
	$('#finish-workout-button').click(function() {
		window.location.href = '/dashboard.html';
		return false;
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
	return `<table id="workout-table" class="table">
				<h2>${workout.workoutName}</h2>
					<thead>
						<tr>
							<th>Exercise Name</th>
							<th>Sets</th>
							<th>Weight</th>
							<th>Reps</th>
							<th></th>
						</tr>
					</thead>
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
		if($('#workout-exercise-form').valid()) {
		$.ajax({
			method: "POST",
			url: '/api/workouts/exercises',
			data: renderNewExercise(workout),
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(exercise) {
			clearExerciseForm();
			showSetsForm(exercise);
			appendNewExercise(exercise);
			watchDeleteExercise();
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
	});
}

function watchDeleteExercise() {
	$('#populate-workout-section').on('click', '#delete-one-exercise', function(e) {
		$.ajax({
			method: "GET",
			url: `/api/workouts/sets/${$(this).closest('tbody').attr('id')}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
				deleteAllTheSets(sets);
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  				let err = eval("(" + xhr.responseText + ")");
  				alert(err.Message);
			}
		});
		$(this).closest('tbody').remove();
	});
}

function deleteTheExercise(sets) {
	$.ajax({
			method: "DELETE",
			url: `/api/workouts/exercises/${sets[0].exerciseRef}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
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

function deleteAllTheSets(sets) {
	for(let i=0; i<sets.length; i++) {
		$.ajax({
			method: "DELETE",
			url: `/api/workouts/sets/${sets[i]._id}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function() {

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

	deleteTheExercise(sets)
}

function watchDeleteOneSet(sets) {
	$('#populate-workout-section').on('click', '#delete-one-set', function(e) {
		$.ajax({
			method: "DELETE",
			url: `/api/workouts/sets/${$(this).closest('tr').attr('id')}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  				let err = eval("(" + xhr.responseText + ")");
  				alert(err.Message);
			}
		});
		$(this).closest('tr').remove();
	});
}

function renderExerciseRepr(exercise) {
	return `
		<tbody id="${exercise._id}">
			<tr class="exercise-info">
				<td><strong><em>${exercise.exerciseName}</strong></em></td>
				<td></td>
				<td></td>
				<td></td>
				<td><button id="delete-one-exercise" class="delete-exercise-sets right"><i class="fa fa-times" aria-hidden="true"></i></button></td>
			</tr>
		</tbody>`;	
}

function appendNewExercise(exercise) {
	$('#workout-table').append(renderExerciseRepr(exercise)).fadeIn('fast');
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
	return `<tr id="${sets._id}" class="set-info">
				<td></td>
				<td>${sets.setNumber}</td>
				<td>${sets.setWeight}</td>
				<td>${sets.setReps}</td>
				<td><button id="delete-one-set" class="delete-exercise-sets right"><i class="fa fa-times" aria-hidden="true"></i></button></td>
			</tr>`;
}

function appendNewSet(sets) {
	$(`#${sets.exerciseRef}`).append(renderSetsRepr(sets)).fadeIn('fast');
		watchDeleteOneSet(sets)
}

function watchSetSubmit(exercise) {
	$('#exercise-sets-form').off().on('click', '#add-set-button', event => {
		event.preventDefault();
		if($('#exercise-sets-form').valid()) {
		$.ajax({
			method: "POST",
			url: '/api/workouts/sets',
			data: renderNewSets(exercise),
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
			appendNewSet(sets);
			clearSetsForm();
			addNextExercise();
			enableNextExerciseButton();
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
	});
}

function enableNextExerciseButton() {
	$('#next-exercise-button').attr('disabled', false);
}

function addNextExercise() {
	$('#workout-exercise-form-container').on('click', '#next-exercise-button', event => {
		event.preventDefault();
		$('#next-exercise-button').attr('disabled', 'disabled');
		$('#exercise-sets-form').fadeOut('fast').toggleClass('hidden');
		setTimeout(function() {
			$('#workout-exercise-form').fadeIn('fast').toggleClass('hidden');
		}, 200);
	});
}

function clearSetsForm() {
	$('#set-number').val('');
	$('#set-weight').val('');
	$('#set-reps').val('');
}

function watchFormToggle() {
	$('#workout-exercise-form-container').on('click', '#toggle-form-button', event => {
		event.preventDefault();
		$('#set-number').toggleClass('hidden');
		$('#set-weight').toggleClass('hidden');
		$('#set-reps').toggleClass('hidden');
		$('#add-set-button').toggleClass('hidden');
		$('label').toggleClass('hidden');
		$('.dropdown').toggleClass('hidden');
		$('#next-exercise-button').toggleClass('hidden');
		$('#exercise-sets-form').toggleClass('toggled');
	});
}

function watchUserIcon() {
    $('.navbar').on('click', '.navbar-brand', event => {
        window.location.href = 'dashboard.html';
    });
}

function validateWorkoutForm() {
	$("form[name='workoutExerciseForm']").validate({
		rules: {
			workoutParamsMuscleGroup: "required",
			workoutParamsExerciseName: "required"
		},

		messages: {
			workoutParamsMuscleGroup: "Please enter a workout name",
			workoutParamsExerciseName: "Please enter an exercise name",
		},
	});
}

function validateSetsForm() {
	$("form[name='workoutSetsForm']").validate({
		rules: {
			setNumber: "required",
			setWeight: "required",
			setReps: "required"
		},

		messages: {
			setNumber: "Please enter a set number",
			setWeight: "Please enter a set weight",
			setReps: "please enter set reps"
		},
	});
}

function validateExerciseForm() {
	$("form[name='workout']").validate({
		rules: {
			workoutName: "required",
		},

		messages: {
			workoutName: "Please enter a workout name",
		},
	});
}

function handleCreateWorkout() {
	showWorkoutForm();
	watchNewWorkout();
	watchFormToggle();
	watchUserIcon();
	validateWorkoutForm();
	validateExerciseForm();
	validateSetsForm();
}

$(handleCreateWorkout);
