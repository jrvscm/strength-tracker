function watchLogIn() {
	$('#log-in').on('click', '#logInButton', event => {
		event.preventDefault();
		let uname = $('#username');
		localStorage.setItem("username", uname.val());
		sendLogIn();
		$('#username').val('');
		$('#passord').val('');
	});
}

function renderLogIn() {
	return `{
		"username": "${$('#username').val()}",
		"password": "${$('#password').val()}"
	}`
}

function renderSignUpLogIn() {
	return `{
		"username": "${$('#usernameSignUp').val()}",
		"password": "${$('#passwordSignUp').val()}"
	}`
}

function sendLogIn() {
	$.ajax({
		method: "POST",
		url: '/api/auth/login/',
		data: renderLogIn(),
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
	//ajax
}

function watchSignUp() {
	$('#sign-up').on('click', '#signUpButton', event => {
		event.preventDefault();
		sendNewUser();
	});
}

function renderNewUser() {
	return `{
		"firstName": "${$('#firstNameSignUp').val()}",
		"lastName": "${$('#lastNameSignUp').val()}",
		"username": "${$('#userNameSignUp').val()}",
		"password": "${$('#passwordSignUp').val()}"
	}`
}

function sendNewUser() {
	$.ajax({
		method: "POST",
		url: '/api/users/',
		data: renderNewUser(),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(data) {
			console.log(data)
		},
		error: function(xhr, status, error) {
  			var err = eval("(" + xhr.responseText + ")");
  			alert(err.Message);
		}
	})
	.then(
		$.ajax({
		method: "POST",
		url: '/api/auth/login/',
		data: renderSignUpLogIn(),
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
	}));
}


function handleLogin() {
	watchSignUp();
	watchLogIn();
}

$(handleLogin);