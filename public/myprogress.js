let graphExerciseObjs = [];

function renderChart(sets) {
let ctx = $('#exerciseChart')[0].getContext('2d');
let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Weight Lifted",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        }]
    },

    // Configuration options go here
    options: {
        layout: {
            padding: {
                left: 150,
                right: 150,
                top: 200,
                bottom: 200
            }
        }
    }
});
    for(i=0; i<sets.length; i++) {
        chart.data.datasets[0].data.push(sets[i].setWeight);
        chart.data.labels.push(sets[i].setNumber);
    }
    
    setTimeout(function() { chart.update(); },100);
}

function getExerciseData() {
    $.ajax({
        method: "GET",
        url: `/api/workouts/myworkouts/${localStorage.getItem('userId')}`,
        data:"",
        contentType: "application/json; charset=utf-8",
        dataType : "json",
        success: function(workouts) {
            console.log('got workouts')
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
        console.log(workouts[i])
        $.ajax({
            method: "GET",
            url: `/api/workouts/exercises/${workouts[i]._id}`,
            data:"",
            contentType: "application/json; charset=utf-8",
            dataType : "json",
            success: function(exercises) {
                renderDropdownChoices(exercises);
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
    graphExerciseObjs = [];

    for(let i=0; i<exercises.length; i++) {
        if(graphExerciseObjs.indexOf(exercises[i]._id) == -1) {
            graphExerciseObjs.push(exercises[i]);
        }
    }
    filterGraphExerciseObjs();
}

function filterGraphExerciseObjs() {
    $('#create-new-chart').on('click', '#create-new-chart-button', function(e) {
        event.preventDefault();
    let matchedExercises = [];

        for(let i=0; i<graphExerciseObjs.length; i++) {
            if(graphExerciseObjs[i].exerciseName == $('#exercise-name').val()) {
                matchedExercises.push(graphExerciseObjs[i]);
            }
        }
        getGraphSets(matchedExercises);
    });
}

function getGraphSets(matchedExercises) {
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

function renderDropdownChoices(exercises) {
    for(let i=0; i<exercises.length; i++) {
        $('#user-exercise-names').append(`<li id="userExercise">${exercises[i].exerciseName}</li>`);
    }
watchExerciseForm();
}

function watchExerciseForm() {
     $('#create-new-chart').off().on('click', '#exercise-name', event => {
        $('#user-exercise-names').toggleClass('hidden');
    });
     watchLiClicks();
}

function watchLiClicks() {
    $('#create-new-chart').on('click', '#userExercise', function(e) {
        $('#exercise-name').val($(e.target).text());
        $('#user-exercise-names').toggleClass('hidden');
    });
}


function viewProgress() {
    getExerciseData();
}


$(viewProgress);