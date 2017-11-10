function watchLogIn() {
	$('#log-in').on('click', '#logInButton', event => {
		event.preventDefault();
		sendLogIn();
	});
}

function renderLogIn() {
	return `{
		"username": "${$('#username').val()}",
		"password": "${$('#password').val()}"
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
		window.location.href = '/loggedin.html';
		},
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

	console.log()
	sendNewUser();
}

function sendNewUser(newUser) {
	$.ajax({
		method: "POST",
		url: '/api/users/',
		data: renderNewUser(),
		contentType: "application/json; charset=utf-8",
		dataType : "json",
		success: function(data) {
			console.log(data)
		}
	});//ajax
}


function handleLogin() {
	watchSignUp();
	watchLogIn();
}

$(handleLogin);