function getUserWorkouts() {
	watchUserIcon();
	$.ajax({
		method: "GET",
		url: `/api/workouts/myworkouts/${localStorage.getItem('userId')}`,
		data:"",
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(workouts) {
			mapWorkouts(workouts);
		},
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
		},
		error: function(xhr, status, error) {
  		    	alert('Something went wrong');
		}
	});
}

function mapWorkouts(workouts) {
	$('#userWorkoutsList').append(`<h2>${localStorage.getItem('username')}'s Workouts</h2>`);

	for(let i=0; i<workouts.length; i++) {
		$('#userWorkoutsList').append(`<li><a href="#" id="${workouts[i]._id}" class="workoutLink">${workouts[i].workoutName}</a></li>`);
	}
	watchUserWorkoutList();
}

function watchUserWorkoutList() {
	$('#userWorkoutsList li').on('click', '.workoutLink', function(e) {
		let workoutID = $(e.target).attr('id');
		$.ajax({
			method: "GET",
			url: `/api/workouts/${workoutID}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(workout) {
				appendBaseWorkoutTable(workout);
				getExercisesList(workoutID, workout);

			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  		    	alert('Something went wrong');
			}
		});
	});
}

function getExercisesList(workoutID, workout) {
	$.ajax({
		method: "GET",
		url: `/api/workouts/exercises/${workout._id}`,
		data:"",
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(exercises) {
			appendExercises(exercises);
			getSets(exercises, workout);
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  		    	alert('Something went wrong');
			}
		});
}

function appendExercises(exercises) {
	for(let i=0; i<exercises.length; i++) {
		$('#workout-table-body').append(`<tr id="${exercises[i]._id}" class="exercise-tr">
											<td><strong><em>${exercises[i].exerciseName}</strong></em></td>
											<td></td>
											<td></td>
											<td></td>
										 </tr>`);
	}
}


function getSets(exercises, workout) {
	for(let i=0; i<exercises.length; i++) {
		$.ajax({
			method: "GET",
			url: `/api/workouts/sets/${exercises[i]._id}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
				appendSets(sets);
				watchDelete(workout, exercises, sets);
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  		    	alert('Something went wrong');
			}
		});
	}
}

function watchDelete(workout, exercises, sets) {
	function deleteSets(sets) {
		for(let i=0; i<sets.length; i++) {
			$.ajax({
			method: "DELETE",
			url: `/api/workouts/sets/${sets[i]._id}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
				
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  		    	alert('Something went wrong');
			}
		});
	}
}

function deleteExercises(exercises) {
	for(let i=0; i<exercises.length; i++) {
		$.ajax({
			method: "DELETE",
			url: `/api/workouts/exercises/${exercises[i]._id}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
				
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  		    	alert('Something went wrong');
			}
		});
	}

}

function deleteWorkout(workout) {
		$.ajax({
			method: "DELETE",
			url: `/api/workouts/${workout._id}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(workout) {
				
			},
			beforeSend: function(xhr, settings) { 
				xhr.setRequestHeader('Authorization','Bearer ' + `${localStorage.getItem('authToken')}`); 
			},
			error: function(xhr, status, error) {
  		    	alert('Something went wrong');
			}
		});
}



	$('#userWorkoutsListContainer').on('click', '#delete-button', event => {
		deleteSets(sets);
		deleteExercises(exercises);
		deleteWorkout(workout);
		setTimeout(function() {
		window.location.href = '/myworkouts.html';
	}, 1000);
	});

	$('#userWorkoutsListContainer').on('click', '#return-button', event => {
		$('#renderedWorkout').fadeOut('fast').toggleClass('hidden');
		setTimeout(function() {
		$('#userWorkoutsList').fadeIn('fast').toggleClass('hidden');
		},200);
	});

}


function appendSets(sets) {
	for(let i = sets.length; i--;) {
		$('#' + sets[i].exerciseRef).after(
			`<tr class="sets-tr">
				<td></td>
				<td>${sets[i].setNumber}</td>
				<td>${sets[i].setWeight}</td>
				<td>${sets[i].setReps}</td>
			</tr>`);
	}
}

function renderBaseWorkoutTable(workout) {
	return `<div id="renderedWorkout" class="hidden">
			<h2>${workout.workoutName}</h2>
				<table class="table">
					<thead>
						<tr class="trhead">
							<th>Exercise Name</th>
							<th>Sets</th>
							<th>Weight</th>
							<th>Reps</th>
						</tr>
					</thead>
				<tbody id="workout-table-body">
				</tbody>
				</table>
				<button id="return-button" class="btn">Return</button>
				<button id="delete-button" class="btn right">Delete</button>
				</div>`
}

function appendBaseWorkoutTable(workout) {
	$('#renderedWorkout').remove();
	$('#userWorkoutsList').fadeOut('fast').addClass('hidden');
	$('#userWorkoutsListContainer').append(renderBaseWorkoutTable(workout))
	setTimeout(function() {
	$('#renderedWorkout').fadeIn('fast').toggleClass('hidden');
	},200);
}

function watchUserIcon() {
    $('.navbar').on('click', '.navbar-brand', event => {
        window.location.href = 'dashboard.html';
    });
}

$(getUserWorkouts);