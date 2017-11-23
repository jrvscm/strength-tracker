function watchLogIn() {
	$('#log-in').on('click', '#logInButton', event => {
		event.preventDefault();
		let uname = $('#username');
		localStorage.setItem("username", uname.val());
		sendLogIn();
		$('#username').val('');
		$('#password').val('');
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
  			let err = eval("(" + xhr.responseText + ")");
  			alert(err.Message);
		}
	}); //ajax
}

function watchSignUp() {
	$('#sign-up').on('click', '#signUpButton', event => {
		event.preventDefault();
		createNewUser();
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
	console.log($('#userNameSignUp').val());
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
  			var err = eval("(" + xhr.responseText + ")");
  			alert(err.Message);
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
  			let err = eval("(" + xhr.responseText + ")");
  			alert(err.Message);
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

	watchWrongWayClicks() 	
}

function watchWrongWayClicks() {
	$('#log-in').off().on('click', '#signUpButtonLogin', event => {
		event.preventDefault();
		$('#log-in-section').fadeOut('fast').addClass('hidden');
		$('#sign-up-section').fadeIn('fast').removeClass('hidden');
	});

	$('#sign-up').off().on('click', '#logInButtonSignup', event => {
		event.preventDefault();
		$('#sign-up-section').fadeOut('fast').addClass('hidden');
		$('#log-in-section').fadeIn('fast').removeClass('hidden');
	});
}

function handleLogin() {
	watchIntroClicks()
	watchSignUp();
	watchLogIn();
}

$(handleLogin);