
$(function(){
  var config = {
    apiKey: "AIzaSyCyReM-YdixMVFjlHkqf9LW7Q-V_9FF3bo",
    authDomain: "farley-87f66.firebaseapp.com",
    databaseURL: "https://farley-87f66.firebaseio.com",
    projectId: "farley-87f66",
    storageBucket: "farley-87f66.appspot.com",
    messagingSenderId: "568494919953"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var trainRef = database.ref();

$(".submit-button").on ("click", function(event){
  event.preventDefault();
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#destination").val().trim();
  var trainStartTime = $("#first-train-time").val().trim();
  trainStartTime = moment(trainStartTime, "HH:mm").format("X");
  var trainFrequency = $("#frequency").val().trim();

 $("#train-name").val("");
 $("#destination").val("");
 $("#first-train-time").val("");
 $("#frequency").val("");


 trainRef.push({
  trainName:trainName,
  trainDestination:trainDestination,
  trainStartTime:trainStartTime,
  trainFrequency:trainFrequency
 });
});

 
trainRef.on("child_added",function(snapshot){

  $(".train-schedule").show();

  var trainRow = $("<tr>");
  var trainCol = $("<td>");
  trainCol.text(snapshot.val().trainName);
  trainRow.append(trainCol);

  var trainCol = $("<td>");
  trainCol.text(snapshot.val().trainDestination);
  trainRow.append(trainCol);
  
  var trainCol = $("<td>");
  trainCol.text(snapshot.val().trainFrequency);
  trainRow.append(trainCol);


  var startTimeTimestamp = snapshot.val().trainStartTime;
  var nextTime = moment.unix(startTimeTimestamp).format("MM-DD-YYYY,hh:mm A");
  console.log(nextTime);

  var difference = moment().diff(moment(nextTime,"MM-DD-YYYY,hh:mm A"),'minutes');
  console.log(difference);

  if(difference>0){
    while(difference>0){
          nextTime = moment(nextTime,"MM-DD-YYYY,hh:mm A").add(snapshot.val().trainFrequency, 'minutes').format('MM-DD-YYYY,hh:mm A');
          difference = moment().diff(moment(nextTime,"MM-DD-YYYY,hh:mm A"),'minutes');
        }
    
  }

  nextTime = moment(nextTime,"MM-DD-YYYY,hh:mm A").format("hh:mm A");

  var trainCol = $("<td>");
  trainCol.text(nextTime);
  trainRow.append(trainCol);

  var trainCol = $("<td>");
  trainCol.text(difference*(-1));
  trainRow.append(trainCol);

  $(".train-table").append(trainRow);

},function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
});