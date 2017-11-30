function watchLogIn() {
	$('#log-in').on('click', '#logInButton', event => {
		event.preventDefault();
		if($('#log-in').valid()) {
		let uname = $('#username');
		localStorage.setItem("username", uname.val());
		sendLogIn();
		}
	});
}

function renderLoginInfo() {
	return `{
		"username": "${$('#username').val()}",
		"password": "${$('#password').val()}"
	}`;
}

function sendLogIn() {
	$.ajax({
		method: "POST",
		url: '/api/auth/login/',
		data: renderLoginInfo(),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(data) {
		localStorage.setItem('authToken', data.authToken);	
		window.location.href = '/dashboard.html';
		getUserId();
		},
		error: function(xhr, status, error) {
  		    	alert('Something went wrong');
		}
	}); //ajax
}

function watchSignUp() {
	$('#sign-up-container').on('click', '#signUpButton', event => {
		event.preventDefault();
		if($('#sign-up').valid()) {
		createNewUser();
		}
	});
}

function renderNewUser() {
	return `{
		"firstName": "${$('#firstNameSignUp').val()}",
		"lastName": "${$('#lastNameSignUp').val()}",
		"username": "${$('#userNameSignUp').val()}",
		"password": "${$('#passwordSignUp').val()}"
	}`;
}

function createNewUser() {
	let unameSignUp = $('#userNameSignUp');
	localStorage.setItem("username", unameSignUp.val());
	$.ajax({
		method: "POST",
		url: '/api/users/',
		data: renderNewUser(),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(data) {
			localStorage.setItem('userId', data._id);
			loginAfterUserCreated();
		},
		error: function(xhr, status, error) {
  		    	alert('Something went wrong');
		}
	});
}

function renderNewUserLogin() {
	return `{
		"username": "${$('#userNameSignUp').val()}",
		"password": "${$('#passwordSignUp').val()}"
	}`;
}


function loginAfterUserCreated() {

$.ajax({
		method: "POST",
		url: '/api/auth/login/',
		data: renderNewUserLogin(),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(data) {
			localStorage.setItem('authToken', data.authToken);	
			window.location.href = '/dashboard.html';
		},
		error: function(xhr, status, error) {
  		    	alert('Something went wrong');
		}
	});
}

function watchIntroClicks() {
	$('#intro-section').on('click', '#intro-login-button', event => {
		$('#intro-container').fadeOut('fast').addClass('hidden');
		$('#log-in-section').fadeIn('fast').removeClass('hidden');
	});

	$('#intro-section').on('click', '#intro-signup-button', event => {
		$('#intro-section').fadeOut('fast').addClass('hidden');
		$('#sign-up-section').fadeIn('fast').removeClass('hidden');
	});	
	
}

function watchWrongWayClicks() {
	$('#log-in-container').on('click', '#signUpLink', event => {
		event.preventDefault();
		$('#log-in-section').fadeOut('fast').toggleClass('hidden');
		$('#sign-up-section').fadeIn('fast').toggleClass('hidden');
	});

	$('#sign-up-section').on('click', '#logInLink', event => {
		event.preventDefault();
		$('#sign-up-section').fadeOut('fast').toggleClass('hidden');
		$('#log-in-section').fadeIn('fast').toggleClass('hidden');
	});
}

function watchSignUpSubmit() {
	$("form[name='userSignUp']").validate({
		rules: {
			firstNameSignUp: "required",
			lastNameSignUp: "required",
			userNameSignUp: "required",
			passwordSignUp: {
				required: true,
				minlength: 10
			}
		},

		messages: {
			firstNameSignUp: "Please enter your first name",
			lastNameSignUp: "Please enter your last name",
			userNameSignUp: "Please enter a valid username",
			password: {
				required: "Your password must be at least 10 characters long."
			},
		},
	});
}


function watchLogInSubmit() {
	$("form[name='login']").validate({
		rules: {
			username: "required",
			password: {
				required: true,
				minlength: 10
			}
		},

		messages: {
			username: "Please enter a valid username",
			password: {
				required: "Your password must be at least 10 characters long."
			},
		},
	});
}

function handleLogin() {
	watchIntroClicks()
	watchSignUp();
	watchLogIn();
	watchWrongWayClicks();
	watchLogInSubmit();
	watchSignUpSubmit();
}

$(handleLogin);