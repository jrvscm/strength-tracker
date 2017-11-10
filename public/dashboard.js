function watchCreateWorkoutBtn() {
	$('#workout-choices-list').on('click', '#create-workout-button', event => {
		createNewWorkout();
		console.log('clicked')
	});
}

function createNewWorkout() {
	$.ajax({
		method: "PUT",
		url: '/api/workouts',
		data: JSON.stringify({'username': `${localStorage.getItem('username')}`}),
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


$(watchCreateWorkoutBtn);