function getUserWorkouts() {
	$.ajax({
		method: "get",
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
  			let err = eval("(" + xhr.responseText + ")");
  			alert(err.Message);
		}
	});
}

function mapWorkouts(workouts) {
	$('#userWorkoutsList').append(`<h2>${localStorage.getItem('username')}'s Workouts</h2>`);

	for(let i=0; i<workouts.length; i++) {
		$('#userWorkoutsList').append(`<li><a href="#" id="${workouts[i]._id}" class="workoutLink">${workouts[i].workoutName}</a> <i class="fa fa-times"></i></li>`);
	}
	watchUserWorkoutList();
}

function watchUserWorkoutList() {
	$('#userWorkoutsList').on('click', function(e) {
		let workoutID = $(e.target).attr('id');
		$.ajax({
			method: "get",
			url: `/api/workouts/${workoutID}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(workout) {
				appendBaseWorkoutTable(workout);
				getExercisesList(workoutID);
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

function getExercisesList(workoutID) {
	$.ajax({
			method: "get",
			url: `/api/workouts/exercises/${workoutID}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(exercises) {
				console.log(exercises)
				appendExercises(exercises);
				getSets(exercises);

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

function appendExercises(exercises) {
	for(let i=0; i<exercises.length; i++) {
		$('#workout-table-body').append(`<tr id="${exercises[i]._id}">
											<td><strong><em>${exercises[i].exerciseName}</strong></em></td>
										 <tr>`);
	}
}


function getSets(exercises) {
	for(let i=0; i<exercises.length; i++) {
		$.ajax({
			method: "get",
			url: `/api/workouts/sets/${exercises[i]._id}`,
			data:"",
			contentType: "application/json; charset=utf-8",
			dataType : "json",
			success: function(sets) {
				console.log(sets)
				appendSets(sets);
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
}

function appendSets(sets) {
	for(i=0; i<sets.length; i++) {
		console.log(sets[i].exerciseRef)
	}
}

function renderBaseWorkoutTable(workout) {
	return `<div id="renderedWorkout">
			<h2>${workout.workoutName}</h2>
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
				</table>
				</div>`
}

function appendBaseWorkoutTable(workout) {
	$('#userWorkoutsList').fadeOut('fast').addClass('hidden');
	$('#userWorkoutsListContainer').append(renderBaseWorkoutTable(workout)).fadeIn('fast');
	//appendWorkoutExercisesSets(workout);
	console.log(workout);
}

function appendWorkoutExercisesSets(workout) {

}

$(getUserWorkouts);