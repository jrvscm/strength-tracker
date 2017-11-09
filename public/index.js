function watchSignUp() {
	$('#sign-up').on('click', '#signUpButton', event => {
		event.preventDefault();
		renderNewUser();
	});
}

function renderNewUser() {
	let newUser = 
	`{
		"firstName: "${$('#firstNameSignUp').val()}",
		"lastName": "${$('#lastNameSignUp').val()}",
		"username": "${$('#userNameSignUp').val()}",
		"password": "${$('#passwordSignUp').val()}"
	}`

	console.log(newUser)
	sendNewUser(newUser);
}

function sendNewUser(newUser) {
	$.ajax({
		method: "POST",
		url: 'http:///api/users/',
		data: JSON.stringify([
			{newUser}
		]),
		contentType: "application/json; charset=utf-8",
		dataType : "jsonp",
		success: function(data) {
			console.log(data)
		}
	});//ajax
}


function handleLogin() {
	watchSignUp();
}

$(handleLogin);