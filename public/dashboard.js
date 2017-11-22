function watchViewProgressBtn() {
	$('#workout-choices-list').on('click', '#view-progress-button', event => {
		window.location.href = '/myprogress.html';
		getUserId();
	});
}

function watchMyWorkoutsBtn() {
	$('#workout-choices-list').on('click', '#view-all-workouts-button', event=> {
		window.location.href = '/myworkouts.html';
		getUserId();
	});
}

function watchCreateWorkoutBtn() {
	$('#workout-choices-list').on('click', '#create-workout-button', event => {
		window.location.href = '/createworkout.html';
		getUserId();
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


function watchNavBar() {
	$('.navbar-brand').empty().append(`${localStorage.getItem('username')}`);
	$('#navbar-toggle').on('click', '#log-out-button', event => {
		localStorage.clear();
		window.location.href = 'index.html';
	});

	$('#navbar-toggle').on('click', '#dashboard-button', event => {
		window.location.href = 'dashboard.html';
	});

	$('#navbar-toggle').on('click', '.navbar-brand', event => {
		window.location.href = 'dashboard.html';
	});
}


function handleUserPaths() {
	watchCreateWorkoutBtn();
	watchMyWorkoutsBtn();
	watchViewProgressBtn();
	watchNavBar();
}

$(handleUserPaths);