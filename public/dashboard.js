function watchViewProgressBtn() {
	$('#workout-choices-list').on('click', '#view-progress-button', event => {
		getUserId();
		setTimeout(function() {
		window.location.href = '/myprogress.html';
		},500);
	});
}

function watchMyWorkoutsBtn() {
	$('#workout-choices-list').on('click', '#view-all-workouts-button', event=> {
		getUserId();
		setTimeout(function() {
		window.location.href = '/myworkouts.html';
		}, 500);
	});
}

function watchCreateWorkoutBtn() {
	$('#workout-choices-list').on('click', '#create-workout-button', event => {
		getUserId();
		setTimeout(function() {
		window.location.href = '/createworkout.html';
		}, 500);
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
  		    	alert('Something went wrong');
		}
	});
}


function watchNavBar() {
	$('.navbar-brand').empty().append(`${localStorage.getItem('username')} <i class="fa fa-user-circle-o" aria-hidden="true"></i>`);
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