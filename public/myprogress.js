
let userExercises = [];
let ctx = $('#exerciseChart')[0].getContext('2d');
let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Weight Lifted",
            backgroundColor: 'transparent',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        layout: {
            padding: {
                left: 110,
                right: 110,
                top: 50,
                bottom: 110
            }
        }
    }

});

function renderChart(sets){
    for(let i=0; i<sets.length; i++) {
        chart.data.datasets[0].data.push(sets[i].setWeight);
        chart.data.labels.push(`${moment(sets[i].date).format('l')} Set: ${sets[i].setNumber}`);
    }

    setTimeout(function() { 
        chart.update(); 
    },100);  

}


function getExerciseData() {
    $.ajax({
        method: "GET",
        url: `/api/workouts/myworkouts/${localStorage.getItem('userId')}`,
        data:"",
        contentType: "application/json; charset=utf-8",
        dataType : "json",
        success: function(workouts) {
            getTheExercises(workouts);
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

function getTheExercises(workouts) {
    for(let i=0; i<workouts.length; i++) {
        $.ajax({
            method: "GET",
            url: `/api/workouts/exercises/${workouts[i]._id}`,
            data:"",
            contentType: "application/json; charset=utf-8",
            dataType : "json",
            success: function(exercises) {   
                saveExercises(exercises);
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

function saveExercises(exercises) {
    userExercises.push(exercises);
}

function filterDropdownChoices() {
    let exNames = [];
        
    for(let i=0; i<userExercises.length; i++) {
        for(let j=0; j<userExercises[i].length; j++){
            if(exNames.indexOf(userExercises[i][j].exerciseName) == -1) {
                exNames.push(userExercises[i][j].exerciseName);
            }
        }
    }

    renderDropdownChoices(exNames)
}

function renderDropdownChoices(exNames) {
    $('#user-exercise-names').empty();
    for(let i=0; i<exNames.length; i++) {
        $('#user-exercise-names').append(`<li id="userExercise" class="createWorkoutLi">${exNames[i]}</li>`);
    }
    watchLiClicks();
}

function watchExerciseForm() {
     $('#create-new-chart').off().on('click', '#exercise-name', event => {
        $('#user-exercise-names').toggleClass('hidden');
        filterDropdownChoices();
    });
}

function watchLiClicks() {
    $('#user-exercise-names').off().on('click', '#userExercise', function(e) {
        $('#exercise-name').val($(e.target).text());
        $('#user-exercise-names').toggleClass('hidden');
    });
    watchCreateChartBtn();
}

function watchCreateChartBtn() {
    $('#create-new-chart-button').off().on('click', event => {
        event.preventDefault();
        chart.destroy();
        initializeNewChart();
    });
}

function initializeNewChart() {
ctx = $('#exerciseChart')[0].getContext('2d');
chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Weight Lifted",
            backgroundColor: 'transparent',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        layout: {
            padding: {
                left: 50,
                right: 50,
                top: 10,
                bottom:200
            }
        }
    }

});

getMatchedExercises();

}

function getMatchedExercises() {
    let matchedExercises = [];
    for(i=0; i<userExercises.length; i++) {
        for(j=0; j<userExercises[i].length; j++) {
            if(userExercises[i][j].exerciseName === $('#exercise-name').val()) {
                matchedExercises.push(userExercises[i][j]);
            }
        }
    }
    getSetsForGraph(matchedExercises);
}

function getSetsForGraph(matchedExercises) {
    for(let i=0; i<matchedExercises.length; i++) {
    $.ajax({
            method: "GET",
            url: `/api/workouts/sets/${matchedExercises[i]._id}`,
            data:"",
            contentType: "application/json; charset=utf-8",
            dataType : "json",
            success: function(sets) {
                renderChart(sets);
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

function watchUserIcon() {
    $('.navbar').on('click', '.navbar-brand', event => {
        window.location.href = 'dashboard.html';
    });
}

function viewProgress() {
    getExerciseData();
    watchExerciseForm();
    watchUserIcon();
}


$(viewProgress);