# Strength-Tracker
-A simple strength tracking application.

## Track Your Lifts <br />
Sometimes lift tracking can be cumbersome. I hate carrying around a pen and paper to the gym. Strength tracker allows me to Enter
a few fields and save my workouts, weights, and exercises all in one place.

## Track Your Progress <br />
Strength tracker utilizes charts.js to graph every exercise you enter, making it easy to see if you're getting stronger. All 
exercises are imported to the graph, so if you track for an extended period of time, you can get a good idea of where your strength
is headed.

## Technologies <br />
### Front End:
- JavaScript, <br />
- jQuery, <br />
- HTML, <br />
- CSS. <br />

### Back End:
- Node.js (server), <br /> 
- Express (server), <br /> 
- Mongodb/Mongoose/Mlab (database), <br /> 
- Mocha Chai (testing)
- Continuous Integration and Depoloyment with TravisCI.

### Security
- Passwords are encrypted with Bcrypt.js.
- Endpoints are controlled with Passport.js.

### Mongodb/Mongoose/Mlab <br />
The database is made up of 4 different models:
Users, Workouts, Exercises, Sets. Each workout references a specific user, each exercise references a specific workout, and each
set references a specific exercise. This allows the app the interlink all models while easily Creating, Finding, Updating, and Deleting.

## Responsive <br />
Strength Tracker is mobile responsive and supports most major phones/pads for on the go tracking.

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1150197/strength-tracker-landing.png" width="800" height="500">

## Creating Workouts <br />
After logging in or signing up the user is directed to the Tracker's user dashboard, where they can choose the path they wish to take
by clicking on one of three navigation buttons at center screen. Create a Workout, My Progress, and My workouts. 

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1150197/strength-tracker-dashboard.png" width="800" height="500">

To create a workout, the user navigates to the create a workout section. There, they're prompted to enter a workout name. The name is 
saved in the database for future reference and a new form appears with muscle groups and exercises. The dropdown exercise form changes 
values depending on what muscle group is selected in the exercise name field. All major muscle groups are supported.

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1150197/strength-tracker-create-workout.png" width="800" height="500">

After choosing an exercise, it is imported to a table for viewing by the user. Then, a sets form appears letting the user add a set-number
set-weight, and set-reps. These all can be deleted and rebuilt during the creation phase, in case the user makes a mistake. 

When the user is done they can click finish workout to be directed back to the dashboard. At any time the user can hit the log-out button
and be logged out of the app.

## Saved Workouts <br />
After creation workouts are saved in the My Workouts section. Upon navigating there the user can view every workout, ever created.
Clicking on a workout link will take you to a table representation of the selected workout. Here you can delete or return to the users
list of workouts.

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1150197/strength-tracker-workouts-section.png" width="800" height="500">

## My Progress <br />
Here, all exercises are populated into the create chart form. A dropdown appears on click, where the user can select an exercise and see
a graph representation of every set he/she has ever saved of the selected exercise. This allows for long term tracking to easily see if 
you are getting stronger.

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1150197/strength-tracker-graph.png" width="800" height="500">





