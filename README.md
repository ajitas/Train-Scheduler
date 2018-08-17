# Train-Scheduler

<!-- Put a description of what the project is -->
Learning jQuery, Firebase, Moment.js: Interacting with Firebase, Event handlers for Firebase, jQuery Event handlers, Dymanically creating html elements, Moment.js for date and time formats and calculations

#Goal
To make a train scheduler where user can add train information (Name, destination, Start Time and Frequency) and the scheduler will show the data in a table format with the information like Name, Destination, Frequency, Next Arrival Time and Minutes Away. All the data that user inputs gets pushed on the database in order to keep it persistent across all the application users.

## Link to deployed site
<!-- make a link to the deployed site --> 
<!-- [What the user will see](the link to the deployed site) -->
[Train-Scheduler](https://ajitas.github.io/Train-Scheduler/)

## Images
<!-- take a picture of the image and add it into the readme  -->
<!-- ![image title](path or link to image) -->
![Train-Scheduler](assets/images/train-scheduler.png)

## technology used
<!-- make a list of technology used -->
<!-- what you used for this web app, like html css -->

<!-- 
1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item. 
-->
1. HTML
2. CSS/BootStrap
    * box-shadow
    * grid layout
    * bootstrap form
    * bootstrap table
3. Javascript
    * control structure
    * data structures
    * functions
4. jQuery
    * Event Handling
    * Dynamically creating new html elements
    * Appending and removing dynamically created html elements to other html elements
    * Providing attributes to dynamically created html elements
5. Firebase 
    * Keeping data persistent
    * Configurating and initializig Firebase
    * Event handlers (child_added, value)
    * Saving data from application to database
    * Retreiving data from the database and displaying on the webpage
6. Moment.js
    * Date and Time formatting
    * Calculations regarding date and time


## code snippets
<!-- put snippets of code inside ``` ``` so it will look like code -->
<!-- if you want to put blockquotes use a > -->

Configurate and intialize firebase app in order to make a connection between the application and the database. Once new data is entered by the user, data is updated to the database and then displayed on the webpage by extracting the data from the database using snapshots.

Configuration and Initialization
```
var config = {
    apiKey: "AIzaSyCyReM-YdixMVFjlHkqf9LW7Q-V_9FF3bo",
    authDomain: "farley-87f66.firebaseapp.com",
    databaseURL: "https://farley-87f66.firebaseio.com",
    projectId: "farley-87f66",
    storageBucket: "farley-87f66.appspot.com",
    messagingSenderId: "568494919953"
  };
  //initialize firebase
  firebase.initializeApp(config);
  //make a reference to firebase database
  var database = firebase.database();
  //make a reference to database root
  var trainRef = database.ref();
```

Use the database reference made earlier to extract the data from the database. This extracted data can be used to display on the webpage. We dynamically create a table here to show the data received from the snapshot. In this case, we also use moment.js to format and calculate the date and time.
```
//event handler when child added to the trainRef
  trainRef.on("child_added",function(snapshot){

    //show the train schedule table
    $(".train-schedule").show();

    //dynamically create a table row and a table data col
    var trainRow = $("<tr>");
    var trainCol = $("<td>");
    //give it the text of the train name from database
    trainCol.text(snapshot.val().trainName);
    //add the column to the train table row
    trainRow.append(trainCol);

    //dynamically create a table data col
    var trainCol = $("<td>");
    //give it the text of the train destination from database
    trainCol.text(snapshot.val().trainDestination);
    //add the column to the train table row
    trainRow.append(trainCol);
    
    //dynamically create a table data col
    var trainCol = $("<td>");
    //give it the text of the train frequency from teh database
    trainCol.text(snapshot.val().trainFrequency);
    //add the column to the train table row
    trainRow.append(trainCol);

    //get the timestamp of train start time from database
    var startTimeTimestamp = snapshot.val().trainStartTime;
    //convert the timestamp into the format("MM-DD-YYYY,hh:mm A") using moment.js
    var nextTime = moment.unix(startTimeTimestamp).format("MM-DD-YYYY,hh:mm A");
    //find the difference between nextTime and the current time using moment.js
    var difference = moment().diff(moment(nextTime,"MM-DD-YYYY,hh:mm A"),'minutes');

    //if difference is positive i.e currenttime is ahead of nextTime
    if(difference>0){
      //while difference is not negative i.e currenttime is behind the nextTime
      while(difference>0){
        //calculate the nexttime of the train using frequency
        //add frequency minutes to the nextTime
        nextTime = moment(nextTime,"MM-DD-YYYY,hh:mm A").add(snapshot.val().trainFrequency, 'minutes').format('MM-DD-YYYY,hh:mm A');
          //find the difference between nextTime and the current time using moment.js
        difference = moment().diff(moment(nextTime,"MM-DD-YYYY,hh:mm A"),'minutes');
      }
    }
    //Got the next train time 
    //convert it to format("hh:mm A")
    nextTime = moment(nextTime,"MM-DD-YYYY,hh:mm A").format("hh:mm A");

    //dynamically create a table data col
    var trainCol = $("<td>");
    //give it the text of the next train time
    trainCol.text(nextTime);
    //add the column to the train table row
    trainRow.append(trainCol);

    //dynamically create a table data col
    var trainCol = $("<td>");
    //give it the text of the difference between the next train and the current time
    trainCol.text(difference*(-1));
    //add the column to the train table row
    trainRow.append(trainCol);

    $("tbody").append(trainRow);
  },
  //when error occurs
  function(errorObject) {
    //show error code
    console.log("Errors handled: " + errorObject.code);
  });
```

On click of submit button, we are saving the inout data from the user to the database
```
//click event handler on submit button
  $(".submit-button").on ("click", function(event){
    //prevent refreshing the page on click of submit button
    event.preventDefault();

    //get the train name from the text box
    var trainName = $("#train-name").val().trim();
    //get the traindestination from the text box
    var trainDestination = $("#destination").val().trim();
    //get the start time of the train from the text box
    var trainStartTime = $("#first-train-time").val().trim();
    //convert the start time ti unix timestamp using moment.js
    trainStartTime = moment(trainStartTime, "HH:mm").format("X");
    //get the train frequency from the text box
    var trainFrequency = $("#frequency").val().trim();

    //clear the form textboxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");

    //push the values in the database
    trainRef.push({
      trainName:trainName,
      trainDestination:trainDestination,
      trainStartTime:trainStartTime,
      trainFrequency:trainFrequency
    });
  });
```
## Learning points
* Event Handling in jQuery
* Dynamically creating and removing html elements using jQuery
* Appending and emptying dynamically created html elements to/from other html elements using jQuery
* Providing attributes to dynamically created html elements using jQuery
* Using Firebase for keeping data persistent across the application users
* Saving, Updating, Retreiving data from Firebase
* Using event handlers in Firebase
* Date time formatting and calculations using Moment.js


## Author 
[Ajita Srivastava](https://github.com/ajitas)

## License
Standard MIT License