
//document.ready
$(function(){
  //configuration for firebase connection
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
  var trainRef = database.ref("/train");

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
    //if difference between current time and next arrival time is 0
    if(difference === 0){
      //show boarding message
      trainCol.text("Boarding");
    }
    else{
    //give it the text of the difference between the next train and the current time
    trainCol.text(difference*(-1));
    }
    //add the column to the train table row
    trainRow.append(trainCol);

    //append the row to the table body
    $("tbody").append(trainRow);
  },
  //when error occurs
  function(errorObject) {
    //show error code
    console.log("Errors handled: " + errorObject.code);
  });
});